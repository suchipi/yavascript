/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />

const index_arm64_bin = build({
  rule: "to-bytecode",
  inputs: [builddir("bundles/index-arm64.js")],
  implicitInputs: implicitInputs["to-bytecode"],
  output: builddir("bytecode/index-arm64.bin"),
});

const index_x86_64_bin = build({
  rule: "to-bytecode",
  inputs: [builddir("bundles/index-x86_64.js")],
  implicitInputs: implicitInputs["to-bytecode"],
  output: builddir("bytecode/index-x86_64.bin"),
});

if (process.arch === "arm64") {
  build({
    rule: "copy",
    inputs: [index_arm64_bin],
    output: builddir("bytecode/index.bin"),
  });
} else {
  build({
    rule: "copy",
    inputs: [index_x86_64_bin],
    output: builddir("bytecode/index.bin"),
  });
}
