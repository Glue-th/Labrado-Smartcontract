const hre = require("hardhat");
const { ethers } = require("hardhat");
const {
  copyArtifactsToChainInfo,
} = require("../utils/copyArtifactsToChainInfo");
const {
  getAddressFromMapJson,
  setAddressToMapJson,
} = require("../utils/readWriteFileMapJson");

async function main() {
  const chainId = hre.network.config.chainId;
  [deployer] = await ethers.getSigners();

  const Operator = await hre.ethers.getContractFactory("LabradoOperator");
  const operator = await Operator.deploy(deployer.address);
  await operator.deployed();

  await copyArtifactsToChainInfo();
  await setAddressToMapJson(chainId, "LabradoOperator", operator.address);

  let token = getAddressFromMapJson(chainId, "LabradoToken");
  let amulet = getAddressFromMapJson(chainId, "LabradoAmulet");
  let amuletCrystal = getAddressFromMapJson(chainId, "LabradoAmuletCrystal");
  let weapon = getAddressFromMapJson(chainId, "LabradoWeapon");
  let weaponCrystal = getAddressFromMapJson(chainId, "LabradoWeaponCrystal");
  let Gem = getAddressFromMapJson(chainId, "LabradoGem");
  await operator.setSupportTokens(token, true);
  await operator.setSupportTokens(
    "0x0000000000000000000000000000000000000000",
    true
  );
  await operator.setSupportNfts(amulet, true);
  await operator.setSupportNfts(amuletCrystal, true);
  await operator.setSupportNfts(weapon, true);
  await operator.setSupportNfts(weaponCrystal, true);
  await operator.setSupportNfts(Gem, true);
  console.log("\nLabradoOperator: ", operator.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
