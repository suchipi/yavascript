#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

const rootDir = GitRepo.findRoot(__dirname);
cd(rootDir);

const docsBuildNinjaPath = rootDir.concat("dist/docs/build.ninja");
if (!exists(docsBuildNinjaPath)) {
  ensureDir(dirname(docsBuildNinjaPath));
  writeFile(docsBuildNinjaPath, "");
}

const existingBuildNinjaContent = readFile(docsBuildNinjaPath);

const newBuildNinjaContent = $([
  "node_modules/.bin/shinobi",
  Path.join(__dirname, "assemble-docs.ninja.js"),
]).stdout;

if (newBuildNinjaContent !== existingBuildNinjaContent) {
  writeFile(docsBuildNinjaPath, newBuildNinjaContent);
}

exec(["ninja", "-f", docsBuildNinjaPath.toString()], {
  cwd: rootDir.toString(),
});
