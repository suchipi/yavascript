/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />

import { walkJsDeps } from "../scripts/lib/walk.js";

const layer2_deps = walkJsDeps("src/layer2/index.ts", {
  useKameResolver: true,
});

const layer2_arm64_js = build({
  rule: "kame",
  inputs: "src/layer2/index.ts",
  implicitInputs: layer2_deps,
  output: builddir("bundles/layer2-arm64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "arm64",
  },
});
const layer2_x86_64_js = build({
  rule: "kame",
  inputs: "src/layer2/index.ts",
  implicitInputs: layer2_deps,
  output: builddir("bundles/layer2-x86_64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "x86_64",
  },
});

const layer2_arm64_bin = build({
  rule: "to-bytecode",
  inputs: [layer2_arm64_js],
  output: builddir("bundles/layer2-arm64.bin"),
});
const layer2_x86_64_bin = build({
  rule: "to-bytecode",
  inputs: [layer2_x86_64_js],
  output: builddir("bundles/layer2-x86_64.bin"),
});

const layer2_arm64_bin_js = build({
  rule: "make-array-buffer-script",
  inputs: [layer2_arm64_bin],
  output: builddir("bundles/layer2-arm64.bin.js"),
  ruleVariables: {
    GLOBAL_NAME: "__bytecode_layer2",
  },
});
const layer2_x86_64_bin_js = build({
  rule: "make-array-buffer-script",
  inputs: [layer2_x86_64_bin],
  output: builddir("bundles/layer2-x86_64.bin.js"),
  ruleVariables: {
    GLOBAL_NAME: "__bytecode_layer2",
  },
});

export { layer2_arm64_bin_js, layer2_x86_64_bin_js };
