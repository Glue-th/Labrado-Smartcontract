const hre = require("hardhat");
const { ethers } = require("hardhat");

const { getAddressFromMapJson } = require("../utils/readWriteFileMapJson");

async function main() {
  [deployer] = await ethers.getSigners();
  const chainId = hre.network.config.chainId;
  let addressRouter = getAddressFromMapJson(chainId, "LabradoRouter02");
  let addressUSDC = getAddressFromMapJson(chainId, "USDC");
  let addressLabradoToken = getAddressFromMapJson(chainId, "LabradoToken");

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

  const USDC = await ethers.getContractFactory("TestERC20", deployer);
  const usdc = await USDC.attach(addressUSDC);

  let txApproveUSDC = await usdc.approve(
    addressRouter,
    "0xffffffffffffffffffffffffffffffffffffffff"
  );
  await txApproveUSDC.wait(1);

  let txApproveLBRD = await labradoToken.approve(
    addressRouter,
    "0xffffffffffffffffffffffffffffffffffffffff"
  );
  await txApproveLBRD.wait(1);

  let txAddLiquidLBRD_USDC = await router.addLiquidity(
    addressUSDC,
    addressLabradoToken,
    "1000000000000000000000000",
    "1000000000000000000000000",
    "1000000000000000000000000",
    "1000000000000000000000000",
    deployer.address,
    1111111111111
  );
  await txAddLiquidLBRD_USDC.wait(1);
  console.log("\nAdd Liquidity LBRD/USDC Done: ", txAddLiquidLBRD_USDC.hash);

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
