const express = require("express");
const router = express.Router();
const blockchainService = require("../blockchain/serviceLedger");

// Testnet status endpoint
router.get("/status", async (req, res) => {
  try {
    const network = process.env.NODE_ENV || "development";
    const isTestnet = network === "testnet";
    
    // Get blockchain info
    const networkInfo = await blockchainService.getNetworkInfo();
    const contractInfo = await blockchainService.getContractInfo();
    const gasPrice = await blockchainService.getGasPrice();
    
    res.json({
      success: true,
      environment: network,
      blockchain: {
        mode: blockchainService.mockMode ? "mock" : "real",
        network: networkInfo,
        contract: contractInfo,
        gasPrice: gasPrice,
        connected: contractInfo.isConnected
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check transaction status
router.get("/transaction/:txHash", async (req, res) => {
  try {
    const { txHash } = req.params;
    const status = await blockchainService.getTransactionStatus(txHash);
    
    res.json({
      success: true,
      transactionHash: txHash,
      ...status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check address balance
router.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await blockchainService.checkBalance(address);
    
    res.json({
      success: true,
      ...balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get contract info
router.get("/contract", async (req, res) => {
  try {
    const contractInfo = await blockchainService.getContractInfo();
    
    res.json({
      success: true,
      ...contractInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;