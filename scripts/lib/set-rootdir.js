/// <reference path="../../dist/yavascript.d.ts" />

const thisFile = import.meta.url.replace(/^file:\/\//, "");
const thisDir = $(["dirname", thisFile]).stdout.trim();
if (!thisDir) {
  throw new Error("dirname failed");
}
const rootDir = $(["realpath", `${thisDir}/../..`]).stdout.trim();
if (!rootDir) {
  throw new Error("realpath failed");
}

if (pwd() !== rootDir) {
  cd(rootDir);
}
