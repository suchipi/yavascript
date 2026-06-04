/// <reference types="@suchipi/shinobi/globals.d.ts" />
const path = require("path");

const includeFiles = glob("src/**/*.inc.d.ts");

const dtsFolderPaths = new Set();
includeFiles.forEach((match) => {
  dtsFolderPaths.add(path.dirname(match));
});

const includePaths = [
  ...dtsFolderPaths,
  "src/templates",
  // I accidentally forgot to deduplicate the dts files with the 0.15.0 publish.
  // It doesn't matter which platform's dts files we use; they're all the same.
  "node_modules/@suchipi/quickjs/build/aarch64-apple-darwin/dts",
];

const quickjsDtsFiles = glob(
  "node_modules/@suchipi/quickjs/build/aarch64-apple-darwin/dts/*",
);

const dtsRaw = build({
  rule: "macaroni",
  inputs: ["src/templates/yavascript.d.ts.tmpl"],
  output: builddir("dts/yavascript-raw.d.ts"),
  implicitInputs: [...includeFiles, ...quickjsDtsFiles],
  ruleVariables: {
    INCLUDE_PATHS: JSON.stringify(includePaths.join(",")),
  },
});
build({
  rule: "prettier",
  ruleVariables: {
    PRETTIER_FLAGS: "--ignore-path ''",
  },
  inputs: [dtsRaw],
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
