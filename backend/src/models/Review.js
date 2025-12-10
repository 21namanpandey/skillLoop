const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    sessionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Session", 
      required: true 
    },
    reviewerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    reviewedId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["provider", "client"], 
      required: true 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      required: true 
    },
    comment: { type: String, maxlength: 500 },
    tags: [{ type: String }],
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ReviewSchema.index({ sessionId: 1, reviewerId: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);