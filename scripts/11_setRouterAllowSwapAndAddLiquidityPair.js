const hre = require("hardhat");
const { ethers } = require("hardhat");
const { WBNB } = require("../configs/wbnb");

const { getAddressFromMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  [deployer] = await ethers.getSigners();
  const chainId = hre.network.config.chainId;
  let addressFactory = getAddressFromMapJson(chainId, "LabradoFactory");
  let addressRouter = getAddressFromMapJson(chainId, "LabradoRouter02");
  let addressWBNB = WBNB[chainId];
  let addressLabradoToken = getAddressFromMapJson(chainId, "LabradoToken");
  const LabradoFactory = await ethers.getContractFactory(
    "LabradoFactory",
    deployer
  );
  const factory = await LabradoFactory.attach(addressFactory);
  let txSetRouterForLBRD_BNB = await factory.setMultiSetRoutersPair(
    addressLabradoToken,
    addressWBNB,
    [addressRouter],
    [true]
  );

  await txSetRouterForLBRD_BNB.wait(1);
  console.log(
    "\nSet Routers For Pair LBRD/BNB Done: ",
    txSetRouterForLBRD_BNB.hash
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
