/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />

const quickjs = require("@suchipi/quickjs");

// # copy stuff into npm folder
// cp -R bin meta/npm
// cp README.md meta/npm
// rm -rf meta/npm/dist
// mkdir -p meta/npm/dist

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
    inputs: [builddir(`dist/bundles/${filename}`)],
    output: `meta/npm/dist/${filename}`,
  });
}
