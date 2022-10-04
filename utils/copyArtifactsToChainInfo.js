require("dotenv").config();
const fse = require("fs-extra");

const srcDir = "artifacts";
const destDir = "chain-info";

exports.copyArtifactsToChainInfo = () => {
  try {
    fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("success!");
      }
    });
  } catch (err) {
    console.error(err);
  }
};
