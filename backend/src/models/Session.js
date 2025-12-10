const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    providerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    clientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    serviceName: { type: String, required: true },
    category: { type: String, required: true },
    scheduledAt: { type: Date },
    plannedHours: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["scheduled", "completed_pending_confirmation", "completed_confirmed"],
      default: "scheduled"
    },
    providerConfirmed: { type: Boolean, default: false },
    clientConfirmed: { type: Boolean, default: false },
    
    onChainTxHash: { 
      type: String, 
      default: null 
    },
    onChainSessionId: { 
      type: Number, 
      default: null 
    },
    isMockBlockchain: {
      type: Boolean,
      default: true
    },
    blockchainNetwork: {
      type: String,
      enum: ["mock", "sepolia", "mainnet"],
      default: "mock"
    },
    blockchainError: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);