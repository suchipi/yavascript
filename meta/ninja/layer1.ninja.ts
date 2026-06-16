/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />

import { walkJsDeps } from "../scripts/lib/walk.js";

const layer1_js = build({
  rule: "kame",
  inputs: "src/layer1/index.ts",
  implicitInputs: walkJsDeps("src/layer1/index.ts", {
    useKameResolver: true,
  }),
  output: builddir("bundles/layer1.js"),
});

const layer1_bin = build({
  rule: "to-bytecode",
  inputs: [layer1_js],
  output: builddir("bytecode/layer1.bin"),
});

const layer1_bin_js = build({
  rule: "make-array-buffer-script",
  inputs: [layer1_bin],
  output: builddir("bytecode/layer1.bin.js"),
  ruleVariables: {
    GLOBAL_NAME: "__bytecode_layer1",
  },
});

export { layer1_bin_js };
