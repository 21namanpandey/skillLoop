const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema(
  {
    sessionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Session", 
      required: true 
    },
    raisedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    against: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    reason: { 
      type: String, 
      enum: ["poor_quality", "not_completed", "time_mismatch", "other"],
      required: true 
    },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["open", "under_review", "resolved", "dismissed"],
      default: "open" 
    },
    resolution: {
      decision: { type: String, enum: ["refund_points", "partial_points", "no_action", "penalty"] },
      moderatorNotes: String,
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      resolvedAt: Date
    },
    evidence: [{
      type: { type: String, enum: ["image", "document", "link"] },
      url: String,
      description: String
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", DisputeSchema);