/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />

import { walkJsDeps } from "../scripts/lib/walk.js";

const layer4_js = build({
  rule: "kame",
  inputs: "src/layer4/index.ts",
  implicitInputs: walkJsDeps("src/layer4/index.ts", { useKameResolver: true }),
  output: builddir("bundles/layer4.js"),
});

const layer4_bin = build({
  rule: "to-bytecode",
  inputs: [layer4_js],
  output: builddir("bundles/layer4.bin"),
});

const layer4_bin_js = build({
  rule: "make-array-buffer-script",
  inputs: [layer4_bin],
  output: builddir("bundles/layer4.bin.js"),
  ruleVariables: {
    GLOBAL_NAME: "__bytecode_layer4",
  },
});

export { layer4_bin_js };
