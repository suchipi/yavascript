/// <reference types="@suchipi/shinobi/globals.d.ts" />

const quickjs = require("@suchipi/quickjs");

for (const platform of quickjs.platforms) {
  const programPath = `bin/${platform.name}/yavascript${platform.programSuffix}`;

  build({
    rule: "copy",
    inputs: builddir(programPath),
    output: `meta/npm/${programPath}`,
  });
}

build({
  rule: "copy",
  inputs: builddir("yavascript.d.ts"),
  output: "meta/npm/yavascript.d.ts",
});

build({
  rule: "copy",
  inputs: ["README.md"],
  output: "meta/npm/README.md",
});

for (const filename of [
  "index-x86_64.js",
  "index-arm64.js",
  "primordials-x86_64.js",
  "primordials-arm64.js",
]) {
  build({
    rule: "copy",
    inputs: [builddir(`bundles/${filename}`)],
    output: `meta/npm/dist/${filename}`,
  });
}
