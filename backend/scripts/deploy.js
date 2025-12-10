const hre = require("hardhat");

async function main() {
  console.log("Deploying ServiceSessionLedger...");
  
  // Get the contract factory
  const ServiceSessionLedger = await hre.ethers.getContractFactory("ServiceSessionLedger");
  
  // Deploy the contract
  const ledger = await ServiceSessionLedger.deploy();
  
  // Wait for deployment to complete
  await ledger.waitForDeployment();
  
  // Get the contract address
  const address = await ledger.getAddress();
  
  console.log("✅ ServiceSessionLedger deployed to:", address);
  
  // Optional: Verify contract on Etherscan
  // if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
  //   console.log("Verifying contract on Etherscan...");
  //   await hre.run("verify:verify", {
  //     address: address,
  //     constructorArguments: [],
  //   });
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });