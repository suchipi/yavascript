var path = require("path");

var binDir = path.resolve(__dirname, "..", "bin");

function getBinaryPath(platformAndArch) {
  switch (platformAndArch) {
    case "darwin-arm64": {
      return path.join(binDir, "darwin-arm64", "yavascript");
    }
    case "darwin-x64": {
      return path.join(binDir, "darwin-x86_64", "yavascript");
    }
    case "linux-arm64": {
      return path.join(binDir, "linux-aarch64", "yavascript");
    }
    case "linux-x64": {
      return path.join(binDir, "linux-amd64", "yavascript");
    }
    case "win32-x64": {
      return path.join(binDir, "windows-x86_64", "yavascript.exe");
    }
    default: {
      throw new Error("Unsupported platform: " + platformAndArch);
    }
  }
}

var binaryPath = getBinaryPath(process.platform + "-" + process.arch);

module.exports = {
  getBinaryPath: getBinaryPath,
  binaryPath: binaryPath,
};
