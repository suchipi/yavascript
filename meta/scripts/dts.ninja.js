/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />
const path = require("path");

console.error("Finding .inc.d.ts files...");
const includeFiles = glob("src/**/*.inc.d.ts");

const dtsFolderPaths = new Set();
includeFiles.forEach((match) => {
  dtsFolderPaths.add(path.dirname(match));
});

const includePaths = [
  ...dtsFolderPaths,
  "src/templates",
  "node_modules/@suchipi/quickjs/build/dts",
];

console.error("Finding .d.ts files in QuickJS...");
const quickjsDtsFiles = glob("node_modules/@suchipi/quickjs/build/dts/*");

const dtsRaw = build({
  rule: "macaroni",
  inputs: ["src/templates/yavascript.d.ts.tmpl"],
  output: builddir("dts/yavascript-raw.d.ts"),
  implicitInputs: [...includeFiles, ...quickjsDtsFiles],
  ruleVariables: {
    INCLUDE_PATHS: JSON.stringify(includePaths.join(",")),
  },
});
const dtsPrettified = build({
  rule: "prettier",
  inputs: [dtsRaw],
  output: builddir("yavascript-prettified.d.ts"),
});

build({
  rule: "copy-if-different",
  inputs: [dtsPrettified],
  output: builddir("yavascript.d.ts"),
});

const dtsGitRaw = build({
  rule: "macaroni",
  inputs: ["src/templates/yavascript-git.d.ts.tmpl"],
  output: builddir("dts/yavascript-git-raw.d.ts"),
  implicitInputs: [...includeFiles, ...quickjsDtsFiles],
  ruleVariables: {
    INCLUDE_PATHS: JSON.stringify(includePaths.join(",")),
  },
});
build({
  rule: "prettier",
  inputs: [dtsGitRaw],
  output: "yavascript.d.ts",
});
