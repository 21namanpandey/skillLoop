const MatchRequest = require("../models/MatchRequest");
const User = require("../models/User");
const Session = require("../models/Session");

exports.createRequest = async (req, res) => {
  try {
    const { providerId, serviceName, category, message } = req.body;
    const requesterId = req.user.id;

    if (String(providerId) === String(requesterId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own service"
      });
    }

    const existingRequest = await MatchRequest.findOne({
      requesterId,
      providerId,
      serviceName,
      category,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this service"
      });
    }

    // Check if provider exists
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found"
      });
    }

    // Check if provider offers this service
    const serviceExists = provider.skillsOffer.some(
      service => service.serviceName === serviceName && service.category === category
    );

    if (!serviceExists) {
      return res.status(400).json({
        success: false,
        message: "Provider does not offer this service"
      });
    }

    // Create request
    const request = await MatchRequest.create({
      requesterId,
      providerId,
      serviceName,
      category,
      message: message || ""
    });

    const populatedRequest = await MatchRequest.findById(request._id)
      .populate("requesterId", "name email")
      .populate("providerId", "name email");

    res.status(201).json({
      success: true,
      request: populatedRequest
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await MatchRequest.find({ providerId: req.user.id })
      .populate("requesterId", "name email bio location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Get incoming requests error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getOutgoingRequests = async (req, res) => {
  try {
    const requests = await MatchRequest.find({ requesterId: req.user.id })
      .populate("providerId", "name email bio location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Get outgoing requests error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const request = await MatchRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    // Check permissions
    if (String(request.providerId) !== String(userId) && 
        String(request.requesterId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // ✅ ADD THIS: Additional check for self-acceptance
    if (status === "accepted" && String(request.providerId) === String(request.requesterId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot accept your own request"
      });
    }

    // Update status
    request.status = status;
    await request.save();

    // If request is accepted, create a session
    if (status === "accepted") {
      const existingSession = await Session.findOne({
        providerId: request.providerId,
        clientId: request.requesterId,
        serviceName: request.serviceName,
        status: { $in: ["scheduled", "completed_pending_confirmation"] }
      });

      if (!existingSession) {
        await Session.create({
          providerId: request.providerId,
          clientId: request.requesterId,
          serviceName: request.serviceName,
          category: request.category,
          status: "scheduled"
        });
      }
    }

    const populatedRequest = await MatchRequest.findById(request._id)
      .populate("requesterId", "name email")
      .populate("providerId", "name email");

    res.json({
      success: true,
      request: populatedRequest
    });
  } catch (error) {
    console.error("Update request status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};