const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ServiceSessionLedger to Sepolia...");
  
  try {
    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("📋 Deployer:", deployer.address);
    
    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH");
    
    if (balance < hre.ethers.parseEther("0.01")) {
      console.log("❌ Insufficient funds!");
      process.exit(1);
    }
    
    console.log("📦 Deploying contract...");
    
    // Get contract factory and deploy
    const ServiceSessionLedger = await hre.ethers.getContractFactory("ServiceSessionLedger");
    const contract = await ServiceSessionLedger.deploy();
    
    console.log("📤 Transaction sent!");
    
    // Wait for deployment (new method for v2.27.1)
    await contract.waitForDeployment();
    
    // Get the address (new method)
    const address = await contract.getAddress();
    
    console.log("\n🎉✅ CONTRACT DEPLOYED!");
    console.log("📍 Address:", address);
    console.log("🔗 Etherscan: https://sepolia.etherscan.io/address/" + address);
    
    // Get deployment transaction hash
    const deploymentTx = contract.deploymentTransaction();
    if (deploymentTx) {
      console.log("📊 Transaction:", deploymentTx.hash);
      console.log("⏳ Waiting for confirmations...");
      
      // Wait for 2 confirmations
      const receipt = await deploymentTx.wait(2);
      console.log("📦 Block:", receipt.blockNumber);
      console.log("⛽ Gas Used:", receipt.gasUsed.toString());
      
      // Save deployment info
      const fs = require("fs");
      const deploymentInfo = {
        network: "sepolia",
        contract: "ServiceSessionLedger",
        address: address,
        deployer: deployer.address,
        blockNumber: receipt.blockNumber,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        "deployment-sepolia.json",
        JSON.stringify(deploymentInfo, null, 2)
      );
      
      console.log("✅ Deployment info saved!");
    }
    
    console.log("\n📝 NEXT STEPS:");
    console.log("1. Update .env with: CONTRACT_ADDRESS=" + address);
    console.log("2. Restart backend server");
    console.log("3. Test blockchain integration!");
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main();