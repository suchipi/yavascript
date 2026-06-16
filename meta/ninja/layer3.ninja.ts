/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />

import { walkJsDeps } from "../scripts/lib/walk.js";

const layer3_js = build({
  rule: "kame",
  inputs: "src/layer3/index.ts",
  implicitInputs: walkJsDeps("src/layer3/index.ts", { useKameResolver: true }),
  output: builddir("bundles/layer3.js"),
});

const layer3_bin = build({
  rule: "to-bytecode",
  inputs: [layer3_js],
  output: builddir("bundles/layer3.bin"),
});

const layer3_bin_js = build({
  rule: "make-array-buffer-script",
  inputs: [layer3_bin],
  output: builddir("bundles/layer3.bin.js"),
  ruleVariables: {
    GLOBAL_NAME: "__bytecode_layer3",
  },
});

export { layer3_bin_js };
