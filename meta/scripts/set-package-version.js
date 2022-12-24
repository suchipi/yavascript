#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

function main(newVersion) {
  cd(repoRoot());

  const currentVersion = readJson("./package.json").version;
  console.log(`current version: ${currentVersion}`);

  console.log(`new version: ${newVersion}`);

  const pkgJsonFiles = ["./package.json", "./meta/npm/package.json"];

  for (const pkgJsonFile of pkgJsonFiles) {
    const pkg = readJson(pkgJsonFile);
    pkg.version = newVersion;
    writeJson(pkgJsonFile, pkg);
    console.log(`updated ${pkgJsonFile}`);
  }

  // update package-lock.json
  exec("npm install");
}

function readJson(filepath) {
  return JSON.parse(readFile(filepath));
}

function writeJson(filepath, data) {
  writeFile(filepath, JSON.stringify(data, null, 2) + "\n");
}

function readArgv() {
  const { args } = parseScriptArgs();

  const newVersion = args[0];
  if (!newVersion) {
    throw new Error("Please specify the new version.");
  }

  return [newVersion];
}

main(...readArgv());
