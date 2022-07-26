var path = require("path");

var binaryPath;
if (process.platform === "win32") {
  binaryPath = path.resolve(__dirname, "..", "bin", "win32", "yavascript.exe");
} else if (process.platform === "darwin") {
  binaryPath = path.resolve(__dirname, "..", "bin", "darwin", "yavascript");
} else if (process.platform === "linux") {
  binaryPath = path.resolve(__dirname, "..", "bin", "linux", "yavascript");
} else {
  throw new Error("Unsupported platform: " + process.platform);
}

module.exports = binaryPath;
