const mongoose = require("mongoose");

const MockTransactionSchema = new mongoose.Schema(
  {
    sessionId: { 
      type: String, 
      required: true 
    },
    hash: { 
      type: String, 
      required: true,
      unique: true 
    },
    provider: { 
      type: String, 
      required: true 
    },
    client: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    units: { 
      type: Number, 
      required: true 
    },
    blockNumber: { 
      type: Number, 
      default: 0 
    },
    isMock: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockTransaction", MockTransactionSchema);