#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(repoRoot());

const currentVersion = JSON.parse(readFile("./package.json")).version;
console.log(`current version: ${currentVersion}`);

const newVersion = scriptArgs[2];
if (!newVersion) {
  throw new Error("Please specify the new version.");
}
console.log(`new version: ${newVersion}`);

const pkgJsonFiles = ["./package.json", "./meta/npm/package.json"];

for (const pkgJsonFile of pkgJsonFiles) {
  const pkg = JSON.parse(readFile(pkgJsonFile));
  pkg.version = newVersion;
  writeFile(pkgJsonFile, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`updated ${pkgJsonFile}`);
}
