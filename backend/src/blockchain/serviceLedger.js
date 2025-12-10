const { ethers } = require("ethers");
const MockTransaction = require("../models/MockTransaction");

// ABI for the ServiceSessionLedger contract
const CONTRACT_ABI = [
  "function logService(uint256 _sessionId, address _provider, address _client, string memory _category, uint256 _units) public",
  "function getSessionsCount() public view returns (uint256)",
  "function getSession(uint256 index) public view returns (uint256, address, address, string memory, uint256, uint256)",
  "function getSessionsByAddress(address _address) public view returns (uint256[] memory)",
  "function sessionLogged(uint256) public view returns (bool)",
  "function owner() public view returns (address)" 
];

class BlockchainService {
  constructor() {
    this.initialize();
  }

  initialize() {
    const rpcUrl = process.env.RPC_URL || '';
    const isLocal = !rpcUrl || rpcUrl.includes('localhost') || rpcUrl.includes('127.0.0.1');
    
    if (isLocal || process.env.NODE_ENV === 'development') {
      this.mockMode = true;
      console.log("🔧 Using MOCK blockchain mode");
    } else {
      this.mockMode = false;
      console.log("🔗 Using REAL blockchain (Sepolia Testnet)");
      
      try {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
          console.warn("⚠️ CONTRACT_ADDRESS not set in .env");
          this.contract = null;
        } else {
          this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
          console.log(`✅ Contract connected: ${contractAddress.substring(0, 10)}...`);
        }
      } catch (error) {
        console.error("❌ Failed to initialize blockchain:", error.message);
        this.mockMode = true; // Fallback to mock
      }
    }
  }

  async logService(sessionId, providerAddr, clientAddr, category, units) {
    try {
      console.log("📝 Logging to blockchain:", { 
        sessionId, 
        provider: providerAddr, 
        client: clientAddr, 
        category, 
        units 
      });
      
      // MOCK MODE
      if (this.mockMode) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTxHash = `0xmock${Date.now()}${Math.random().toString(16).slice(2)}`;
        const mockBlock = Math.floor(Math.random() * 10000);
        
        const mockTx = await MockTransaction.create({
          sessionId: sessionId.toString(),
          hash: mockTxHash,
          provider: providerAddr,
          client: clientAddr,
          category,
          units,
          blockNumber: mockBlock,
          isMock: true,
          network: 'mock'
        });
        
        console.log(`✅ MOCK: Session saved (${mockTxHash})`);
        
        return {
          success: true,
          transactionHash: mockTxHash,
          blockNumber: mockBlock,
          mock: true,
          network: 'mock'
        };
      }
      
      // REAL MODE - Sepolia Testnet
      if (!this.contract) {
        throw new Error("Contract not initialized. Check CONTRACT_ADDRESS in .env");
      }
      
      // Validate addresses
      if (!ethers.isAddress(providerAddr) || !ethers.isAddress(clientAddr)) {
        throw new Error("Invalid Ethereum address");
      }
      
      console.log("⛽ Estimating gas...");
      
      try {
        // Estimate gas
        const gasEstimate = await this.contract.logService.estimateGas(
          sessionId,
          providerAddr,
          clientAddr,
          category,
          units
        );
        
        console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
        
        // Send transaction
        const tx = await this.contract.logService(
          sessionId,
          providerAddr,
          clientAddr,
          category,
          units,
          {
            gasLimit: gasEstimate + 10000n, // Add buffer
          }
        );
        
        console.log(`📤 Transaction sent: ${tx.hash}`);
        console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
        
        // Wait for confirmation (1 block)
        const receipt = await tx.wait(1);
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        
        return {
          success: true,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          mock: false,
          network: 'sepolia',
          explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`
        };
        
      } catch (txError) {
        console.error("Transaction error:", txError.message);
        throw txError;
      }
      
    } catch (error) {
      console.error("❌ Blockchain logging error:", error.message);
      
      return {
        success: false,
        error: error.message,
        mock: this.mockMode,
        network: this.mockMode ? 'mock' : 'sepolia'
      };
    }
  }

  async getSessionCount() {
    try {
      if (this.mockMode) {
        return await MockTransaction.countDocuments();
      }
      
      if (!this.contract) return 0;
      
      const count = await this.contract.getSessionsCount();
      return parseInt(count.toString());
    } catch (error) {
      console.error("Error getting session count:", error.message);
      return 0;
    }
  }

  async getSessionsByAddress(address) {
    try {
      if (this.mockMode) {
        const transactions = await MockTransaction.find({
          $or: [{ provider: address }, { client: address }]
        }).sort({ createdAt: -1 });
        
        return transactions.map(tx => ({
          id: tx._id,
          sessionId: tx.sessionId,
          hash: tx.hash,
          blockNumber: tx.blockNumber
        }));
      }
      
      if (!this.contract) return [];
      
      const indices = await this.contract.getSessionsByAddress(address);
      
      // Get full session details for each index
      const sessions = [];
      for (const index of indices) {
        try {
          const session = await this.contract.getSession(index);
          sessions.push({
            index: index.toString(),
            sessionId: session[0].toString(),
            provider: session[1],
            client: session[2],
            category: session[3],
            units: session[4].toString(),
            timestamp: new Date(parseInt(session[5].toString()) * 1000)
          });
        } catch (err) {
          console.warn(`Error fetching session at index ${index}:`, err.message);
        }
      }
      
      return sessions;
      
    } catch (error) {
      console.error("Error getting sessions by address:", error.message);
      return [];
    }
  }

  async getTransactionStatus(txHash) {
    try {
      if (this.mockMode) {
        const tx = await MockTransaction.findOne({ hash: txHash });
        return tx ? { 
          status: 'confirmed', 
          blockNumber: tx.blockNumber,
          mock: true 
        } : { status: 'not_found' };
      }
      
      if (!this.provider) return { status: 'provider_not_available' };
      
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) {
        const tx = await this.provider.getTransaction(txHash);
        return tx ? { status: 'pending' } : { status: 'not_found' };
      }
      
      return {
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        mock: false,
        explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`
      };
      
    } catch (error) {
      console.error("Error getting transaction status:", error.message);
      return { status: 'error', error: error.message };
    }
  }

  // Get contract owner
  async getContractOwner() {
    try {
      if (this.mockMode) return "0xMockOwner";
      if (!this.contract) return null;
      
      return await this.contract.owner();
    } catch (error) {
      console.error("Error getting contract owner:", error.message);
      return null;
    }
  }

  // Check if session is logged on blockchain
  async isSessionLogged(sessionId) {
    try {
      if (this.mockMode) {
        const tx = await MockTransaction.findOne({ sessionId: sessionId.toString() });
        return !!tx;
      }
      
      if (!this.contract) return false;
      
      return await this.contract.sessionLogged(sessionId);
    } catch (error) {
      console.error("Error checking session logged:", error.message);
      return false;
    }
  }

  // ADD THIS METHOD: Get network information
  async getNetworkInfo() {
    try {
      if (this.mockMode) {
        return {
          name: 'Mock Network',
          chainId: 1337,
          isTestnet: false,
          isMock: true,
          blockNumber: 0,
          status: 'connected'
        };
      }
      
      if (!this.provider) {
        return {
          name: 'Disconnected',
          chainId: 0,
          isTestnet: false,
          isMock: false,
          status: 'disconnected'
        };
      }
      
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      return {
        name: network.name,
        chainId: Number(network.chainId),
        blockNumber: blockNumber,
        isTestnet: Number(network.chainId) === 11155111, // Sepolia chain ID
        isMock: false,
        status: 'connected'
      };
    } catch (error) {
      console.error("Error getting network info:", error.message);
      return {
        name: 'Error',
        chainId: 0,
        isTestnet: false,
        isMock: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // ADD THIS METHOD: Get contract information
  async getContractInfo() {
    try {
      if (this.mockMode) {
        return {
          address: '0xMockContractAddress',
          owner: '0xMockOwner',
          sessionCount: await this.getSessionCount(),
          isConnected: false,
          isMock: true
        };
      }
      
      if (!this.contract) {
        return {
          address: process.env.CONTRACT_ADDRESS || 'Not set',
          isConnected: false,
          isMock: false
        };
      }
      
      const owner = await this.getContractOwner();
      const sessionCount = await this.getSessionCount();
      
      return {
        address: this.contract.target,
        owner: owner,
        sessionCount: sessionCount,
        isConnected: true,
        isMock: false
      };
    } catch (error) {
      console.error("Error getting contract info:", error.message);
      return {
        address: process.env.CONTRACT_ADDRESS || 'Error',
        isConnected: false,
        isMock: false,
        error: error.message
      };
    }
  }

  // ADD THIS METHOD: Check if address has enough ETH for gas
  async checkBalance(address) {
    try {
      if (this.mockMode) {
        return {
          address: address,
          balance: '100.0',
          hasEnoughForGas: true,
          isMock: true
        };
      }
      
      if (!this.provider) {
        return {
          address: address,
          balance: '0',
          hasEnoughForGas: false,
          error: 'Provider not available'
        };
      }
      
      const balance = await this.provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      
      // Check if has at least 0.001 ETH for gas
      const hasEnoughForGas = balance > ethers.parseEther("0.001");
      
      return {
        address: address,
        balance: balanceInEth,
        hasEnoughForGas: hasEnoughForGas,
        isMock: false
      };
    } catch (error) {
      console.error("Error checking balance:", error.message);
      return {
        address: address,
        balance: '0',
        hasEnoughForGas: false,
        error: error.message
      };
    }
  }

  // ADD THIS METHOD: Get gas price
  async getGasPrice() {
    try {
      if (this.mockMode) {
        return {
          gasPrice: '0.000000001',
          estimatedCost: '0.00001',
          isMock: true
        };
      }
      
      if (!this.provider) {
        return {
          gasPrice: '0',
          estimatedCost: '0',
          error: 'Provider not available'
        };
      }
      
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      
      // Estimate cost for a typical transaction (100,000 gas)
      const estimatedGas = 100000n;
      const estimatedCost = gasPrice * estimatedGas;
      
      return {
        gasPrice: ethers.formatUnits(gasPrice, "gwei"),
        estimatedCost: ethers.formatEther(estimatedCost),
        isMock: false
      };
    } catch (error) {
      console.error("Error getting gas price:", error.message);
      return {
        gasPrice: '0',
        estimatedCost: '0',
        error: error.message
      };
    }
  }
}

module.exports = new BlockchainService();

// class BlockchainService {
//   constructor() {
//     // Check if we're in development mode
//     if (!process.env.RPC_URL || process.env.RPC_URL.includes('localhost') || process.env.RPC_URL.includes('127.0.0.1')) {
//       console.log("🔧 Using MOCK blockchain mode for development");
//       this.mockMode = true;
//     } else {
//       console.log("🔗 Using REAL blockchain mode");
//       this.mockMode = false;
//       this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
//       this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      
//       const contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//       this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
//     }
//   }

//   async logService(sessionId, providerAddr, clientAddr, category, units) {
//     try {
//       console.log("📝 Logging to blockchain:", { sessionId, providerAddr, clientAddr, category, units });
      
//       // MOCK MODE - For development
//       if (this.mockMode) {
//         // Simulate blockchain delay
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         const mockTxHash = `0xmock${Date.now()}${Math.random().toString(16).slice(2)}`;
//         const mockBlock = Math.floor(Math.random() * 10000);
        
//         // Save to database instead of memory
//         const mockTx = await MockTransaction.create({
//           sessionId: sessionId.toString(),
//           hash: mockTxHash,
//           provider: providerAddr,
//           client: clientAddr,
//           category,
//           units,
//           blockNumber: mockBlock,
//           isMock: true
//         });
        
//         console.log(`✅ MOCK: Session saved to database (${mockTxHash})`);
        
//         return {
//           success: true,
//           transactionHash: mockTxHash,
//           blockNumber: mockBlock,
//           mock: true
//         };
//       }
      
//       // REAL MODE - Actual blockchain
//       // ... (keep existing real mode code) ...
      
//     } catch (error) {
//       console.error("❌ Blockchain logging error:", error.message);
//       return {
//         success: false,
//         error: error.message,
//         mock: this.mockMode
//       };
//     }
//   }

//   async getSessionCount() {
//     try {
//       if (this.mockMode) {
//         // Count from database
//         return await MockTransaction.countDocuments();
//       }
      
//       const count = await this.contract.getSessionsCount();
//       return parseInt(count.toString());
//     } catch (error) {
//       console.error("Error getting session count:", error.message);
//       return 0;
//     }
//   }

//   async getSessionsByAddress(address) {
//     try {
//       if (this.mockMode) {
//         // Find transactions where address is provider or client
//         const transactions = await MockTransaction.find({
//           $or: [{ provider: address }, { client: address }]
//         }).sort({ createdAt: -1 });
        
//         // Return just the IDs or indices
//         return transactions.map(tx => tx._id);
//       }
      
//       // Real blockchain code...
      
//     } catch (error) {
//       console.error("Error getting sessions by address:", error.message);
//       return [];
//     }
//   }

//   // Get mock transactions for local explorer
//   async getMockTransactions() {
//     if (this.mockMode) {
//       const transactions = await MockTransaction.find()
//         .sort({ createdAt: -1 })
//         .limit(100);
//       return transactions;
//     }
//     return [];
//   }

//   // Get mock transactions for a specific user
//   async getUserMockTransactions(userWallet) {
//     if (this.mockMode) {
//       const transactions = await MockTransaction.find({
//         $or: [{ provider: userWallet }, { client: userWallet }]
//       }).sort({ createdAt: -1 });
//       return transactions;
//     }
//     return [];
//   }

//   // Clear all mock transactions (for testing)
//   async clearMockTransactions() {
//     if (this.mockMode) {
//       await MockTransaction.deleteMany({});
//       return { success: true, message: "All mock transactions cleared" };
//     }
//     return { success: false, message: "Not in mock mode" };
//   }
// }

// module.exports = new BlockchainService();