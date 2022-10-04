const hre = require("hardhat");
const {
  copyArtifactsToChainInfo,
} = require("../utils/copyArtifactsToChainInfo");
const { setAddressToMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  const chainId = hre.network.config.chainId;

  const Labrado = await hre.ethers.getContractFactory("LabradoToken");
  const labrado = await Labrado.deploy();
  await labrado.deployed();

  await copyArtifactsToChainInfo();
  await setAddressToMapJson(chainId, "LabradoToken", labrado.address);

  console.log("\nLabrado Token:", labrado.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
