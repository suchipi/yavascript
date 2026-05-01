const fs = require("fs");
const { pathMarker } = require("path-less-traveled");
const npmLib = require("../../npm/lib");
const rootDir = require("../../root-dir");

const npmBinDir = pathMarker(rootDir("meta/npm/bin"));

function getBinaryPath(platform, arch) {
  const buildQuickResult = rootDir("dist", "yavascript");
  if (fs.existsSync(buildQuickResult)) {
    return buildQuickResult;
  }

  const npmBinPath = npmLib.getBinaryPath(platform + "-" + arch);
  return rootDir("bin", npmBinDir.relative(npmBinPath));
}

const binaryPath = getBinaryPath(process.platform, process.arch);

module.exports = {
  binaryPath,
  getBinaryPath,
};
