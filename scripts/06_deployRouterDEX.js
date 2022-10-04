const hre = require("hardhat");
const { WBNB } = require("../configs/wbnb");
const {
  copyArtifactsToChainInfo,
} = require("../utils/copyArtifactsToChainInfo");
const {
  setAddressToMapJson,
  getAddressFromMapJson,
} = require("../utils/readWriteFileMapJson");

async function main() {
  const chainId = hre.network.config.chainId;
  let factory = getAddressFromMapJson(chainId, "LabradoFactory");
  const LabradoRouter02 = await hre.ethers.getContractFactory(
    "LabradoRouter02"
  );
  const router = await LabradoRouter02.deploy(factory, WBNB[chainId]);
  await router.deployed();

  await copyArtifactsToChainInfo();
  await setAddressToMapJson(chainId, "LabradoRouter02", router.address);

  console.log("\nLabradoRouter02: ", router.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
