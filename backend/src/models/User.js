const mongoose = require("mongoose");

const SkillOfferSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["Design", "Development", "Video", "Writing", "Mentoring", "Other"]
  },
  description: { type: String },
  mode: { 
    type: String, 
    enum: ["Online", "Offline", "Both"], 
    default: "Online" 
  },
  estimatedHours: { type: Number, default: 1 }
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    walletAddress: { type: String, default: "" },
    skillsOffer: [SkillOfferSchema],
    skillsNeed: [{ type: String }],
    totalHoursProvided: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);