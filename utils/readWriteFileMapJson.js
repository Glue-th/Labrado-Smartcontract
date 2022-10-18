require("dotenv").config();
const fs = require("fs");

const pathToMap = "chain-info/deployments/map.json";

exports.getAddressFromMapJson = (chainId, nameContract) => {
  try {
    if (fs.existsSync(pathToMap)) {
      chainId = typeof chainId != "string" ? chainId.toString() : chainId;
      let rawdata = fs.readFileSync(pathToMap);
      let contractAddress = JSON.parse(rawdata);
      return contractAddress[chainId]
        ? contractAddress[chainId][nameContract]
          ? contractAddress[chainId][nameContract][0]
          : null
        : contractAddress[process.env.CHAIN_ID][nameContract]
        ? contractAddress[process.env.CHAIN_ID][nameContract][0]
        : null;
    }
    return null;
  } catch (err) {
    console.error(err);
  }
};

exports.setAddressToMapJson = (chainId, nameContract, newAddress) => {
  try {
    chainId = typeof chainId != "string" ? chainId.toString() : chainId;
    nameContract =
      typeof nameContract != "string" ? nameContract.toString() : nameContract;
    newAddress =
      typeof newAddress != "string" ? newAddress.toString() : newAddress;
    newAddress = newAddress.toLowerCase();
    if (!fs.existsSync(pathToMap)) {
      let newObject = {};
      newObject[chainId] = {};
      let data = JSON.stringify(newObject, null, 2);
      fs.writeFileSync(pathToMap, data);
    }
    let rawdata = fs.readFileSync(pathToMap);
    let listAddresses = JSON.parse(rawdata);
    if (!listAddresses[chainId]) {
      listAddresses[chainId] = {};
    }
    listAddresses[chainId][nameContract] = [newAddress];
    let data = JSON.stringify(listAddresses, null, 2);
    fs.writeFileSync(pathToMap, data);
  } catch (error) {
    console.log(error);
  }
};
