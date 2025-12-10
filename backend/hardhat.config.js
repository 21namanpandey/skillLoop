// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//     localhost: {
//       url: "http://127.0.0.1:8545",
//       chainId: 1337,
//     },
//     sepolia: {
//       url: process.env.RPC_URL,
//       accounts: [process.env.PRIVATE_KEY],
//     }
//   },
//   paths: {
//     artifacts: "./artifacts",
//     sources: "./contracts",
//     tests: "./test",
//     cache: "./cache"
//   }
// };



require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    sepolia: {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Single key for all networks (V2 style)
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  },
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    tests: "./test",
    cache: "./cache"
  }
};