const mongoose = require("mongoose");

const ReputationSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    points: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    level: { 
      type: String, 
      enum: ["Novice", "Intermediate", "Expert", "Master", "Legend"],
      default: "Novice" 
    },
    badges: [{
      name: String,
      icon: String,
      earnedAt: Date,
      description: String
    }],
    weeklyStats: {
      sessionsCompleted: { type: Number, default: 0 },
      hoursProvided: { type: Number, default: 0 },
      positiveReviews: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

ReputationSchema.methods.updateLevel = function() {
  if (this.points >= 1000) this.level = "Legend";
  else if (this.points >= 500) this.level = "Master";
  else if (this.points >= 200) this.level = "Expert";
  else if (this.points >= 50) this.level = "Intermediate";
  else this.level = "Novice";
  return this;
};

module.exports = mongoose.model("Reputation", ReputationSchema);