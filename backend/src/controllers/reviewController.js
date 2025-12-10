const Review = require("../models/Review");
const Session = require("../models/Session");
const User = require("../models/User");
const Reputation = require("../models/Reputation");
const PointsTransaction = require("../models/PointsTransaction");

exports.createReview = async (req, res) => {
  try {
    const { sessionId, rating, comment, tags } = req.body;
    const reviewerId = req.user.id;

    // Get session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Check if session is completed
    if (session.status !== "completed_confirmed") {
      return res.status(400).json({ 
        success: false, 
        message: "Can only review completed sessions" 
      });
    }

    // Check if user is participant
    const isParticipant = String(session.providerId) === String(reviewerId) || 
                         String(session.clientId) === String(reviewerId);
    if (!isParticipant) {
      return res.status(403).json({ 
        success: false, 
        message: "Only session participants can review" 
      });
    }

    // Determine who is being reviewed
    const isProvider = String(session.providerId) === String(reviewerId);
    const reviewedId = isProvider ? session.clientId : session.providerId;
    const role = isProvider ? "client" : "provider";

    // Check if already reviewed this session
    const existingReview = await Review.findOne({ sessionId, reviewerId });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "Already reviewed this session" 
      });
    }

    // Create review
    const review = await Review.create({
      sessionId,
      reviewerId,
      reviewedId,
      role,
      rating,
      comment: comment || "",
      tags: tags || [],
      isVerified: !!session.onChainTxHash
    });

    // Update user's average rating
    await updateUserRating(reviewedId);

    // Award reputation points for giving review
    if (rating >= 4) {
      await awardReputationPoints(reviewerId, {
        type: "positive_review",
        reviewId: review._id
      });
    }

    // Award points to reviewed user for good rating
    if (rating >= 4) {
      await awardReputationPoints(reviewedId, {
        type: "received_positive_review",
        reviewId: review._id
      });
    }

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUserRating = async (userId) => {
  const reviews = await Review.find({ reviewedId: userId });
  
  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(userId, { 
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length 
    });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reviews = await Review.find({ reviewedId: userId })
      .populate("reviewerId", "name")
      .populate("sessionId", "serviceName category")
      .sort({ createdAt: -1 });

    const stats = {
      total: reviews.length,
      average: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      distribution: [1,2,3,4,5].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length
      }))
    };

    res.json({
      success: true,
      reviews,
      stats
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.checkReview = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const existingReview = await Review.findOne({ 
      sessionId, 
      reviewerId: userId 
    });

    res.json({
      success: true,
      hasReviewed: !!existingReview,
      review: existingReview
    });
  } catch (error) {
    console.error("Check review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Reviews I gave
    const reviewsGiven = await Review.find({ reviewerId: userId })
      .populate("reviewedId", "name")
      .populate("sessionId", "serviceName category")
      .sort({ createdAt: -1 });

    // Reviews I received
    const reviewsReceived = await Review.find({ reviewedId: userId })
      .populate("reviewerId", "name")
      .populate("sessionId", "serviceName category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviewsGiven,
      reviewsReceived
    });
  } catch (error) {
    console.error("Get my reviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Award reputation points
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
  
  // Create transaction record
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

// Get user reputation
exports.getUserReputation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let reputation = await Reputation.findOne({ userId });
    
    if (!reputation) {
      reputation = await Reputation.create({ userId, points: 0 });
    }
    
    // Get points history
    const pointsHistory = await PointsTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get badges
    const badges = await checkBadges(userId);
    
    res.json({
      success: true,
      reputation,
      pointsHistory,
      badges
    });
  } catch (error) {
    console.error("Get reputation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Check and award badges
const checkBadges = async (userId) => {
  const reputation = await Reputation.findOne({ userId });
  if (!reputation) return [];
  
  const badges = [];
  const sessions = await Session.countDocuments({ 
    providerId: userId, 
    status: "completed_confirmed" 
  });
  const reviews = await Review.countDocuments({ reviewedId: userId, rating: { $gte: 4 } });
  
  // First session badge
  if (sessions >= 1 && !reputation.badges.some(b => b.name === "First Session")) {
    badges.push({
      name: "First Session",
      icon: "🎯",
      description: "Completed your first service exchange"
    });
  }
  
  // 5 Sessions badge
  if (sessions >= 5 && !reputation.badges.some(b => b.name === "5 Sessions")) {
    badges.push({
      name: "5 Sessions",
      icon: "🏆",
      description: "Completed 5 service exchanges"
    });
  }
  
  // Excellent Rating badge
  if (reviews >= 3 && !reputation.badges.some(b => b.name === "Excellent Rating")) {
    badges.push({
      name: "Excellent Rating",
      icon: "⭐",
      description: "Received 3+ positive reviews"
    });
  }
  
  // Blockchain Pioneer badge
  const blockchainSessions = await Session.countDocuments({ 
    providerId: userId, 
    onChainTxHash: { $exists: true } 
  });
  if (blockchainSessions >= 1 && !reputation.badges.some(b => b.name === "Blockchain Pioneer")) {
    badges.push({
      name: "Blockchain Pioneer",
      icon: "🔗",
      description: "Logged first session on blockchain"
    });
  }
  
  // Add new badges to reputation
  if (badges.length > 0) {
    badges.forEach(badge => {
      badge.earnedAt = new Date();
      reputation.badges.push(badge);
    });
    await reputation.save();
  }
  
  return reputation.badges;
};