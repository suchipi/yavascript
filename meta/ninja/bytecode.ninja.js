/// <reference types="@suchipi/shinobi/globals.d.ts" />

const index_bin = build({
  rule: "to-bytecode",
  inputs: [builddir("bundles/index.js")],
  output: builddir("bytecode/index.bin"),
});

build({
  rule: "binary-to-c-array",
  inputs: [index_bin],
  ruleVariables: {
    NAME: "yavascript_bytecode",
  },
  output: builddir("bytecode/index.c"),
});
