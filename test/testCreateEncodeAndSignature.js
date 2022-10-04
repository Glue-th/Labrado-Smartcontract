const Web3 = require("web3");
const { ethers } = require("ethers");

require("dotenv").config();

let web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545/"
  )
);

const createSignature = async (
  _chainId,
  _functionName,
  _amount,
  _tokenIn,
  _tokenOut,
  _from,
  _to,
  _expireBlock,
  _nonce
) => {
  let message = await Web3.utils.soliditySha3(
    { t: "uint256", v: _chainId },
    { t: "string", v: _functionName },
    { t: "uint256", v: _amount },
    { t: "address", v: _tokenIn },
    { t: "address", v: _tokenOut },
    { t: "address", v: _from },
    { t: "address", v: _to },
    { t: "uint256", v: _expireBlock },
    { t: "uint256", v: _nonce }
  );
  const signature = await web3.eth.accounts.sign(
    message,
    process.env.BSC_TESTNET_DEPLOYER_PRIVATE_KEY
  );

  return signature.signature;
};

async function encodeData() {
  let signature = await createSignature(
    97,
    "swapTokensForExactTokens",
    "1000000000000000000000",
    "0xEf092d7A3ee0cf6a90fbf5cC10981C3e03079D27",
    "0xe09dd26d773b83cdb910aa44f8144d30e47beddd",
    "0x43F544D8d29AEEb37aa8f6c1c4fC48c7F0081750",
    "0x43F544D8d29AEEb37aa8f6c1c4fC48c7F0081750",
    33235349,
    1
  );
  //   console.log("signature: ", signature);
  let dataEncoded = web3.eth.abi.encodeParameters(
    ["uint256", "uint256", "bytes"], // [exprieBlock, nonce, signature]
    [33235349, 1, signature]
  );
  console.log("EncodeData: ", dataEncoded);
}

encodeData();

//  1. Create encode data as above
//  2. Create instance contract by address and ABI
//  3. usage example:
//     - router.swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin,path,to,deadline,encodeData)
//       +  uint256 amountOutMin  (ex: 1000000000000000 or 2000000000000000,.......... )
//       +  address[] path        (ex: ["0xEf092d7A3ee0cf6a90fbf5cC10981C3e03079D27", "0xe09dd26d773b83cdb910aa44f8144d30e47beddd"],.... )
//       +  address to            (ex: "0x43F544D8d29AEEb37aa8f6c1c4fC48c7F0081750" )
//       +  uint256 deadline      (ex: timestamp 1659320166 or 1659320234,.....)
//       +  bytes encodeData      (ex: "0x000000000000000000000000000000000000000000000000000000000149b4ee00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000004190687c3912b06742c4340bf80c1163a7f2fbd5c6d37e2af252dbe2c66951ba8e0bb5b00b5cd0183b47d0a22bbfd811ca6c4f695234a141e9a4cde6967fb7e5ba1b00000000000000000000000000000000000000000000000000000000000000")
