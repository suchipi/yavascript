#!/usr/bin/env node
var child_process = require("child_process");
var binaryPath = require("./binary-path");

try {
  child_process.execFileSync(binaryPath, process.argv.slice(2), {
    cwd: process.cwd(),
    stdio: "inherit",
  });
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}
