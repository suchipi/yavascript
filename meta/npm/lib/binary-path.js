var path = require("path");
var detectLibc = require("detect-libc");

var binDir = path.resolve(__dirname, "..", "bin");

function getBinaryPath(platformAndArch) {
  switch (platformAndArch) {
    case "darwin-arm64": {
      return path.join(binDir, "aarch64-apple-darwin", "yavascript");
    }
    case "darwin-x64": {
      return path.join(binDir, "x86_64-apple-darwin", "yavascript");
    }
    case "linux-arm64": {
      const abi = detectLibc.familySync();
      switch (abi) {
        case "glibc": {
          return path.join(binDir, "aarch64-unknown-linux-gnu", "yavascript");
        }
        case "musl": {
          return path.join(binDir, "aarch64-unknown-linux-musl", "yavascript");
        }
        default: {
          return path.join(
            binDir,
            "aarch64-unknown-linux-static",
            "yavascript",
          );
        }
      }
    }
    case "linux-x64": {
      const abi = detectLibc.familySync();
      switch (abi) {
        case "glibc": {
          return path.join(binDir, "x86_64-unknown-linux-gnu", "yavascript");
        }
        case "musl": {
          return path.join(binDir, "x86_64-unknown-linux-musl", "yavascript");
        }
        default: {
          return path.join(binDir, "x86_64-unknown-linux-static", "yavascript");
        }
      }
    }
    case "win32-x64": {
      return path.join(binDir, "x86_64-pc-windows-static", "yavascript.exe");
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
