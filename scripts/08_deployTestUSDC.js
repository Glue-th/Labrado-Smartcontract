const hre = require("hardhat");
const {
  copyArtifactsToChainInfo,
} = require("../utils/copyArtifactsToChainInfo");
const { setAddressToMapJson } = require("../utils/readWriteFileMapJson");
async function main() {
  const chainId = hre.network.config.chainId;
  const USDC = await hre.ethers.getContractFactory("TestERC20");
  const usdc = await USDC.deploy("USDC", "USDC");
  await usdc.deployed();
  copyArtifactsToChainInfo();
  setAddressToMapJson(chainId, "USDC", usdc.address);
  console.log("\nUSDC:", usdc.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
