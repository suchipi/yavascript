#!/usr/bin/env node
var child_process = require("child_process");
var binaryPath = require("./binary-path").binaryPath;

try {
  child_process.execFileSync(binaryPath, process.argv.slice(2), {
    cwd: process.cwd(),
    stdio: "inherit",
  });
} catch (err) {
  process.exitCode = 1;
}
