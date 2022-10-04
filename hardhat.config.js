require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.8.1",
      },
    ],
    overrides: {
      "contracts/DEX/swap-core/LabradoFactory": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      "contracts/DEX/periphery/LabradoRouter02.sol": {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      "contracts/TestToken.sol": {
        version: "0.8.0",
      },
    },
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gasLimit: 6000000000,
      defaultBalanceEther: "100000",
      chainId: 31337,
    },
    bsctestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [process.env.BSC_TESTNET_DEPLOYER_PRIVATE_KEY],
      gasLimit: 30000000,
      chainId: 97,
    },
    bscmainnet: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [process.env.BSC_MAINNET_DEPLOYER_PRIVATE_KEY],
      gasLimit: 30000000,
      chainId: 56,
    },
  },

  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
};
