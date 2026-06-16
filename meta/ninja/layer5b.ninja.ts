/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />

import { walkJsDeps } from "../scripts/lib/walk.js";
import { layer1_bin_js } from "./layer1.ninja.ts";
import { layer2_arm64_bin_js, layer2_x86_64_bin_js } from "./layer2.ninja.ts";
import { layer3_bin_js } from "./layer3.ninja.ts";
import { layer4_bin_js } from "./layer4.ninja.ts";

// ===================
// ===== Bundles =====
// ===================

const layer5b_js = build({
  rule: "kame",
  inputs: "src/layer5b/index.ts",
  implicitInputs: walkJsDeps("src/layer5b/index.ts", {
    useKameResolver: true,
  }),
  output: builddir("bundles/layer5b-bundle.js"),
});

export const layer5b_arm64_js = build({
  rule: "combine",
  inputs: [
    layer1_bin_js,
    layer2_arm64_bin_js,
    layer3_bin_js,
    layer4_bin_js,
    layer5b_js,
  ],
  output: builddir("bundles/layer5b-arm64.js"),
});

export const layer5b_x86_64_js = build({
  rule: "combine",
  inputs: [
    layer1_bin_js,
    layer2_x86_64_bin_js,
    layer3_bin_js,
    layer4_bin_js,
    layer5b_js,
  ],
  output: builddir("bundles/layer5b-x86_64.js"),
});

// ====================
// ===== Bytecode =====
// ====================

export const layer5b_arm64_bin = build({
  rule: "to-bytecode",
  inputs: [layer5b_arm64_js],
  output: builddir("bytecode/layer5b-arm64.bin"),
});

export const layer5b_x86_64_bin = build({
  rule: "to-bytecode",
  inputs: [layer5b_x86_64_js],
  output: builddir("bytecode/layer5b-x86_64.bin"),
});
