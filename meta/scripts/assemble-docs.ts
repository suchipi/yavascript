#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />
import * as os from "quickjs:os";

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

let ysBin = os.execPath();
try {
  ysBin = realpath(ysBin);
} catch (err) {
  console.warn(
    "error when running realpath on result of os.execPath; ignoring",
    err
  );
}

const ysBinDir = dirname(ysBin);

exec(["ninja", "-f", docsBuildNinjaPath.toString()], {
  cwd: rootDir.toString(),
  env: {
    ...env,
    PATH: [ysBinDir, env.PATH].join(Path.OS_ENV_VAR_SEPARATOR),
  },
});
