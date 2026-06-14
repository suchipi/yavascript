/// <reference types="@suchipi/shinobi/globals.d.ts" />

const quickjs = require("@suchipi/quickjs");

for (const platform of quickjs.platforms) {
  const yavascriptPath = `bin/${platform.name}/yavascript${platform.programSuffix}`;
  const yavascriptBootstrapPath = `bin/${platform.name}/yavascript-bootstrap${platform.programSuffix}`;

  build({
    rule: "copy",
    inputs: builddir(yavascriptPath),
    output: `meta/npm/${yavascriptPath}`,
  });
  build({
    rule: "copy",
    inputs: builddir(yavascriptBootstrapPath),
    output: `meta/npm/${yavascriptBootstrapPath}`,
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
