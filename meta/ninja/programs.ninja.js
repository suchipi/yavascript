/// <reference types="@suchipi/shinobi/globals.d.ts" />

const platform = require("@suchipi/quickjs").identifyCurrentPlatform();

build({
  rule: "cc",
  inputs: [
    `node_modules/@suchipi/quickjs/build/${platform.name}/lib/quickjs-full.a`,
    builddir("bytecode/index.c"),
    "src/native/main.c",
  ],
  output: builddir("yavascript"),
});
