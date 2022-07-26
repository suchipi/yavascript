var path = require("path");

var binaryPath;
if (process.platform === "win32") {
  binaryPath = path.join(__dirname, "bin", "win32", "ys.exe");
} else if (process.platform === "darwin") {
  binaryPath = path.join(__dirname, "bin", "darwin", "ys");
} else if (process.platform === "linux") {
  binaryPath = path.join(__dirname, "bin", "linux", "ys");
} else {
  throw new Error("Unsupported platform: " + process.platform);
}

module.exports = binaryPath;
