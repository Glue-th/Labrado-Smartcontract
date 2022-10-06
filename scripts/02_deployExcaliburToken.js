const hre = require("hardhat");
const {
  copyArtifactsToChainInfo,
} = require("../utils/copyArtifactsToChainInfo");
const { setAddressToMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  const chainId = hre.network.config.chainId;

  const Excalibur = await hre.ethers.getContractFactory("Excalibur");
  const excalibur = await Excalibur.deploy();
  await excalibur.deployed();

  copyArtifactsToChainInfo();
  setAddressToMapJson(chainId, "ExcaliburToken", excalibur.address);

  console.log("\nLabrado Token:", excalibur.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
