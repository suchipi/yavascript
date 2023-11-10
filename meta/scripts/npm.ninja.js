/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />

const quickjs = require("@suchipi/quickjs");

for (const platform of quickjs.platforms) {
  const programPath = `bin/${platform.name}/yavascript${platform.programSuffix}`;

  build({
    rule: "copy-if-different",
    inputs: builddir(programPath),
    output: `meta/npm/${programPath}`,
    implicitInputs: implicitInputs["copy-if-different"],
  });
}

build({
  rule: "copy-if-different",
  inputs: builddir("yavascript.d.ts"),
  output: "meta/npm/yavascript.d.ts",
  implicitInputs: implicitInputs["copy-if-different"],
});

build({
  rule: "copy-if-different",
  inputs: ["README.md"],
  output: "meta/npm/README.md",
  implicitInputs: implicitInputs["copy-if-different"],
});

for (const filename of [
  "index-x86_64.js",
  "index-arm64.js",
  "primordials-x86_64.js",
  "primordials-arm64.js",
]) {
  build({
    rule: "copy-if-different",
    inputs: [builddir(`dist/bundles/${filename}`)],
    output: `meta/npm/dist/${filename}`,
    implicitInputs: implicitInputs["copy-if-different"],
  });
}
