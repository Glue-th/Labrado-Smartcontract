const hre = require("hardhat");
const { ethers } = require("hardhat");
const { WBNB } = require("../configs/wbnb");

const { getAddressFromMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  [deployer] = await ethers.getSigners();
  const chainId = hre.network.config.chainId;
  let addressRouter = getAddressFromMapJson(chainId, "LabradoRouter02");
  let addressLabradoToken = getAddressFromMapJson(chainId, "LabradoToken");
  let addressWBNB = WBNB[chainId];

  let addressFactory = getAddressFromMapJson(chainId, "LabradoFactory");
  const LabradoFactory = await ethers.getContractFactory(
    "LabradoFactory",
    deployer
  );
  const factory = await LabradoFactory.attach(addressFactory);

  const LabradoRouter02 = await ethers.getContractFactory(
    "LabradoRouter02",
    deployer
  );
  const router = await LabradoRouter02.attach(addressRouter);

  const LabradoToken = await ethers.getContractFactory(
    "LabradoToken",
    deployer
  );
  const labradoToken = await LabradoToken.attach(addressLabradoToken);

  let txApproveLBRD = await labradoToken.approve(
    addressRouter,
    "0xffffffffffffffffffffffffffffffffffffffff"
  );
  await txApproveLBRD.wait(1);

  let addressPairLBRD_BNB = await factory.getPair(
    addressLabradoToken,
    addressWBNB
  );
  const pairLBRD_BNB = await ethers.getContractFactory("LabradoPair", deployer);
  const instancePairLBRD_BNB = await pairLBRD_BNB.attach(addressPairLBRD_BNB);
  let isRouterLBRD_BNB = await instancePairLBRD_BNB.isRouter(addressRouter);
  if (!isRouterLBRD_BNB) {
    let txSetRouterLBRD_BNB = await factory.setMultiSetRoutersPair(
      addressLabradoToken,
      addressWBNB,
      [addressRouter],
      [true]
    );
    await txSetRouterLBRD_BNB.wait(1);
    console.log("\nSet Router LBRD/BNB Done: ", txSetRouterLBRD_BNB.hash);
  }
  let txAddLiquidLBRD_BNB = await router.addLiquidityETH(
    addressLabradoToken,
    "10000000000000000000000",
    "10000000000000000000000",
    "100000000000000000",
    deployer.address,
    1111111111111,
    { value: "100000000000000000" }
  );
  await txAddLiquidLBRD_BNB.wait(1);
  console.log("\nAdd Liquidity LBRD/BNB Done: ", txAddLiquidLBRD_BNB.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
