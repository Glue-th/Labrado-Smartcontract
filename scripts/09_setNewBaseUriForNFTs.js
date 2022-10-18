const hre = require("hardhat");
const { ethers } = require("hardhat");
const { WBNB } = require("../configs/wbnb");

const { getAddressFromMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  [deployer] = await ethers.getSigners();
  const chainId = hre.network.config.chainId;

  let listContracts = [
    [
      "LabradoAmulet",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/amulets/",
    ],
    [
      "LabradoAmuletCrystal",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/amulet_crystals/",
    ],
    [
      "LabradoWeapon",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/weapons/",
    ],
    [
      "LabradoWeaponCrystal",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/weapon_crystals/",
    ],
    ["LabradoGem", "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/gems/"],
  ];

  for (let i = 0; i < listContracts.length; i++) {
    const info = listContracts[i];
    const NFT = await hre.ethers.getContractFactory("LabradoBaseNFT");
    let addressNFT = getAddressFromMapJson(chainId, info[0]);
    const instanceNFT = await NFT.attach(addressNFT);
    let txSetBaseUri = await instanceNFT.setBaseUri(info[1]);
    await txSetBaseUri.wait(1);
    console.log(`\n${info[0]}: `, info[1], " -> set successfully");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
