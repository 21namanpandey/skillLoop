const Session = require("../models/Session");
const User = require("../models/User");
const Reputation = require("../models/Reputation");
const PointsTransaction = require("../models/PointsTransaction");
const blockchainService = require("../blockchain/serviceLedger");

// Helper function for awarding reputation points
const awardReputationPoints = async (userId, data) => {
  let reputation = await Reputation.findOne({ userId });
  
  if (!reputation) {
    reputation = await Reputation.create({ userId, points: 0 });
  }
  
  let points = 0;
  switch (data.type) {
    case "session_completed":
      points = 10 + (data.hours || 1) * 2;
      if (reputation.weeklyStats) {
        reputation.weeklyStats.sessionsCompleted += 1;
        reputation.weeklyStats.hoursProvided += (data.hours || 1);
      }
      break;
    case "positive_review":
      points = 15;
      if (reputation.weeklyStats) {
        reputation.weeklyStats.positiveReviews += 1;
      }
      break;
    case "received_positive_review":
      points = 20;
      break;
    case "on_chain_verified":
      points = 25;
      break;
  }
  
  reputation.points += points;
  reputation.updateLevel();
  await reputation.save();
  
  await PointsTransaction.create({
    userId,
    points,
    type: data.type,
    referenceId: data.sessionId || data.reviewId,
    description: `Earned ${points} points for ${data.type.replace('_', ' ')}`,
    balanceAfter: reputation.points
  });
  
  return points;
};

exports.createSession = async (req, res) => {
  try {
    const { providerId, clientId, serviceName, category, scheduledAt, plannedHours } = req.body;

    const session = await Session.create({
      providerId,
      clientId,
      serviceName,
      category,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      plannedHours: plannedHours || 1,
      status: "scheduled"
    });

    const populatedSession = await Session.findById(session._id)
      .populate("providerId", "name email walletAddress")
      .populate("clientId", "name email walletAddress");

    res.status(201).json({
      success: true,
      session: populatedSession
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Session.find({
      $or: [{ providerId: userId }, { clientId: userId }]
    })
    .populate("providerId", "name email walletAddress")
    .populate("clientId", "name email walletAddress")
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error("Get my sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("providerId", "name email walletAddress bio")
      .populate("clientId", "name email walletAddress bio");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error("Get session by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.confirmSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findById(id)
      .populate("providerId", "name email walletAddress")
      .populate("clientId", "name email walletAddress");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Check if user is involved in the session
    const isProvider = String(session.providerId._id) === String(userId);
    const isClient = String(session.clientId._id) === String(userId);

    if (!isProvider && !isClient) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to confirm this session"
      });
    }

    // Update confirmation status
    if (isProvider) {
      session.providerConfirmed = true;
    }
    if (isClient) {
      session.clientConfirmed = true;
    }

    // Check if both have confirmed
    if (session.providerConfirmed && session.clientConfirmed) {
      session.status = "completed_confirmed";

      // Log to blockchain (only if both have wallet addresses and not the same)
      if (session.providerId.walletAddress && session.clientId.walletAddress &&
          session.providerId.walletAddress !== session.clientId.walletAddress &&
          !session.onChainTxHash) {
        
        try {
          // Generate a unique session ID for blockchain
          const onChainSessionId = Date.now() + Math.floor(Math.random() * 1000);
          
          const result = await blockchainService.logService(
            onChainSessionId,
            session.providerId.walletAddress,
            session.clientId.walletAddress,
            session.category,
            session.plannedHours
          );

          if (result.success) {
            session.onChainTxHash = result.transactionHash;
            session.onChainSessionId = onChainSessionId;
            session.isMockBlockchain = result.mock || false;
            session.blockchainNetwork = result.network || 'mock';
            
            console.log(`✅ Session logged to ${result.network}: ${result.transactionHash}`);
            
            // Update user stats
            await User.findByIdAndUpdate(session.providerId._id, {
              $inc: {
                totalHoursProvided: session.plannedHours,
                totalSessions: 1
              },
              $addToSet: {
                blockchainNetworks: result.network
              }
            });
          } else {
            console.warn("⚠️ Blockchain logging failed:", result.error);
            session.blockchainError = result.error;
          }
        } catch (blockchainError) {
          console.error("Blockchain logging error:", blockchainError);
          session.blockchainError = blockchainError.message;
        }
      } else if (!session.onChainTxHash) {
        console.log("ℹ️ Skipping blockchain logging - missing wallet addresses or same address");
      }

      // Award reputation points to provider
      await awardReputationPoints(session.providerId._id, {
        type: "session_completed",
        hours: session.plannedHours,
        sessionId: session._id
      });

      // If logged on blockchain, award extra points
      if (session.onChainTxHash && !session.isMockBlockchain) {
        await awardReputationPoints(session.providerId._id, {
          type: "on_chain_verified",
          sessionId: session._id
        });
      }
    } else {
      session.status = "completed_pending_confirmation";
    }

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate("providerId", "name email walletAddress")
      .populate("clientId", "name email walletAddress");

    res.json({
      success: true,
      session: updatedSession
    });
  } catch (error) {
    console.error("Confirm session error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getBlockchainStats = async (req, res) => {
  try {
    const totalSessions = await blockchainService.getSessionCount();
    
    // Get user's sessions from blockchain if they have a wallet address
    const user = await User.findById(req.user.id);
    let userSessions = [];
    
    if (user.walletAddress) {
      const sessionIndices = await blockchainService.getSessionsByAddress(user.walletAddress);
      userSessions = sessionIndices;
    }

    res.json({
      success: true,
      stats: {
        totalSessions,
        userSessions
      }
    });
  } catch (error) {
    console.error("Get blockchain stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// New: Get blockchain info for a session
exports.getBlockchainInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }
    
    let blockchainInfo = {
      hasTransaction: !!session.onChainTxHash,
      transactionHash: session.onChainTxHash,
      isMock: session.isMockBlockchain,
      network: session.blockchainNetwork,
      error: session.blockchainError
    };
    
    // If real transaction, get status from blockchain
    if (session.onChainTxHash && !session.isMockBlockchain) {
      const status = await blockchainService.getTransactionStatus(session.onChainTxHash);
      blockchainInfo.transactionStatus = status;
    }
    
    res.json({
      success: true,
      blockchain: blockchainInfo
    });
    
  } catch (error) {
    console.error("Get blockchain info error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};