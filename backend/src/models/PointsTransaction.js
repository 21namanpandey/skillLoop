const mongoose = require("mongoose");

const PointsTransactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    points: { 
      type: Number, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["session_completed", "positive_review", "on_chain_verified", "dispute_won", "weekly_bonus","received_positive_review"],
      required: true 
    },
    referenceId: { 
      type: mongoose.Schema.Types.ObjectId 
    },
    description: { type: String },
    balanceAfter: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PointsTransaction", PointsTransactionSchema);