const hre = require("hardhat");
const { ethers } = require("hardhat");
const {
  copyArtifactsToChainInfo,
} = require("../utils/copyArtifactsToChainInfo");
const { setAddressToMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  const chainId = hre.network.config.chainId;
  [deployer] = await ethers.getSigners();

  const Factory = await hre.ethers.getContractFactory("LabradoFactory");
  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();

  copyArtifactsToChainInfo();
  setAddressToMapJson(chainId, "LabradoFactory", factory.address);
  console.log("\nLabradoFactory", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
