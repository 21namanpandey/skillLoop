const Dispute = require("../models/Dispute");
const Session = require("../models/Session");
const User = require("../models/User");

exports.createDispute = async (req, res) => {
  try {
    const { sessionId, reason, description, evidence } = req.body;
    const raisedBy = req.user.id;

    // Get session
    const session = await Session.findById(sessionId)
      .populate("providerId", "name")
      .populate("clientId", "name");
    
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Check if session is completed
    if (session.status !== "completed_confirmed") {
      return res.status(400).json({ 
        success: false, 
        message: "Can only dispute completed sessions" 
      });
    }

    // Check if user is participant
    const isProvider = String(session.providerId._id) === String(raisedBy);
    const isClient = String(session.clientId._id) === String(raisedBy);
    
    if (!isProvider && !isClient) {
      return res.status(403).json({ 
        success: false, 
        message: "Only session participants can raise disputes" 
      });
    }

    // Determine who the dispute is against
    const against = isProvider ? session.clientId._id : session.providerId._id;

    // Check if dispute already exists
    const existingDispute = await Dispute.findOne({ sessionId, raisedBy });
    if (existingDispute) {
      return res.status(400).json({ 
        success: false, 
        message: "Already raised a dispute for this session" 
      });
    }

    // Create dispute
    const dispute = await Dispute.create({
      sessionId,
      raisedBy,
      against,
      reason,
      description,
      evidence: evidence || []
    });

    res.status(201).json({
      success: true,
      dispute
    });
  } catch (error) {
    console.error("Create dispute error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMyDisputes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const disputes = await Dispute.find({
      $or: [{ raisedBy: userId }, { against: userId }]
    })
    .populate("sessionId", "serviceName category")
    .populate("raisedBy", "name")
    .populate("against", "name")
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      disputes
    });
  } catch (error) {
    console.error("Get disputes error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getDispute = async (req, res) => {
  try {
    const { id } = req.params;
    
    const dispute = await Dispute.findById(id)
      .populate("sessionId")
      .populate("raisedBy", "name email")
      .populate("against", "name email")
      .populate("resolution.resolvedBy", "name");

    if (!dispute) {
      return res.status(404).json({ success: false, message: "Dispute not found" });
    }

    // Check if user is involved
    const userId = req.user.id;
    const isInvolved = String(dispute.raisedBy._id) === String(userId) || 
                      String(dispute.against._id) === String(userId);

    if (!isInvolved && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({
      success: true,
      dispute
    });
  } catch (error) {
    console.error("Get dispute error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};