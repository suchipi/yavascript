var getBinaryPath = require("./binary-path").getBinaryPath;
var binaryPath = require("./binary-path").binaryPath;
var version = require("../package.json").version;

module.exports = {
  getBinaryPath,
  binaryPath,
  version,
};
