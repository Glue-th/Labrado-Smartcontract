const hre = require("hardhat");
const { ethers } = require("hardhat");
const { WBNB } = require("../configs/wbnb");

const { getAddressFromMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  [deployer] = await ethers.getSigners();
  const chainId = hre.network.config.chainId;
  let addressFactory = getAddressFromMapJson(chainId, "LabradoFactory");
  let addressWBNB = WBNB[chainId];
  let addressLabradoToken = getAddressFromMapJson(chainId, "LabradoToken");
  const LabradoFactory = await ethers.getContractFactory(
    "LabradoFactory",
    deployer
  );
  const factory = await LabradoFactory.attach(addressFactory);

  let pairLBRD_BNB = await factory.getPair(addressLabradoToken, addressWBNB);
  if (pairLBRD_BNB === "0x0000000000000000000000000000000000000000") {
    let txCreatePair = await factory.createPair(
      addressLabradoToken,
      addressWBNB
    );
    await txCreatePair.wait(1);
    console.log("\nCreate Pair LBRD/BNB Done: ", txCreatePair.hash);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
