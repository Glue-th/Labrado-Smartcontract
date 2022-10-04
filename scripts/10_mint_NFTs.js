const hre = require("hardhat");
const { ethers } = require("hardhat");
const {} = require("../utils/copyArtifactsToChainInfo");
const { getAddressFromMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  const chainId = hre.network.config.chainId;
  let [deployer] = await ethers.getSigners();

  let reciever = "0xC6644bF800C41a6da0bd04237bB0684088549A9E";

  let listContracts = [
    { symbol: "LabradoAmulet", numberMint: 3 },
    { symbol: "LabradoAmuletCrystal", numberMint: 3 },
    { symbol: "LabradoWeapon", numberMint: 3 },
    { symbol: "LabradoWeaponCrystal", numberMint: 3 },
    { symbol: "LabradoGem", numberMint: 3 },
  ];
  console.log(`\n`);
  for (let i = 0; i < listContracts.length; i++) {
    const infoMint = listContracts[i];
    let addressNFT = getAddressFromMapJson(chainId, infoMint.symbol);
    let arrayNumberMint = Array(infoMint.numberMint).fill(reciever);
    const LabradoBaseNFT = await ethers.getContractFactory(
      "LabradoBaseNFT",
      deployer
    );
    const nft = await LabradoBaseNFT.attach(addressNFT);
    let tx = await nft.mintByBatch(arrayNumberMint);
    await tx.wait(1);
    console.log(
      `Transaction mint batch ${infoMint.symbol} - ${infoMint.numberMint} NFTs: ${tx.hash}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
