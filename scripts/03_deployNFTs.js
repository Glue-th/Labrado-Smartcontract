const hre = require("hardhat");
const {
  copyArtifactsToChainInfo,
} = require("../utils/copyArtifactsToChainInfo");
const { setAddressToMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  const chainId = hre.network.config.chainId;

  let listContracts = [
    [
      "Amulet",
      "LAML",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/amulets/",
      "LabradoAmulet",
    ],
    [
      "Amulet Crystal",
      "LACR",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/amulet_crystals/",
      "LabradoAmuletCrystal",
    ],
    [
      "Weapon",
      "LWPN",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/weapons/",
      "LabradoWeapon",
    ],
    [
      "Weapon Crystal",
      "LWPC",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/weapon_crystals/",
      "LabradoWeaponCrystal",
    ],
    [
      "Gem",
      "LGEM",
      "https://sandbox-gms.a.dev.lbrd.xyz/api_v1/metadata/gems/",
      "LabradoGem",
    ],
  ];

  console.log(`\n`);
  for (let i = 0; i < listContracts.length; i++) {
    const info = listContracts[i];
    const NFT = await hre.ethers.getContractFactory("LabradoBaseNFT");
    const nft = await NFT.deploy(info[0], info[1], info[2]);
    await nft.deployed();

    setAddressToMapJson(chainId, info[3], nft.address);
    console.log(`\n${info[3]}: `, info[0], info[1], nft.address);
  }
  copyArtifactsToChainInfo();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
