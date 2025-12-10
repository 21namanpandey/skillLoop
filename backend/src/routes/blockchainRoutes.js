const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const blockchainService = require("../blockchain/serviceLedger");
const User = require("../models/User");

// Get local/mock transactions
router.get("/local-transactions", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let transactions = [];
    
    if (user.walletAddress) {
      // Get transactions for this user's wallet
      transactions = await blockchainService.getUserMockTransactions(user.walletAddress);
    } else {
      // Get all transactions if no wallet
      transactions = await blockchainService.getMockTransactions();
    }
    
    res.json({
      success: true,
      transactions,
      isMockMode: blockchainService.mockMode,
      userWallet: user.walletAddress
    });
  } catch (error) {
    console.error("Get local transactions error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get ALL mock transactions (admin/view all)
router.get("/local-transactions/all", async (req, res) => {
  try {
    const transactions = await blockchainService.getMockTransactions();
    res.json({
      success: true,
      transactions,
      total: transactions.length
    });
  } catch (error) {
    console.error("Get all local transactions error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Clear mock transactions (for testing)
router.delete("/local-transactions/clear", async (req, res) => {
  try {
    const result = await blockchainService.clearMockTransactions();
    res.json(result);
  } catch (error) {
    console.error("Clear transactions error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;