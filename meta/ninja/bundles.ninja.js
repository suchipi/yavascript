/// <reference types="@suchipi/shinobi/globals.d.ts" />
const { walkJsDeps } = require("../scripts/lib/walk");

const moduleFilenames = walkJsDeps("src/index.ts", { useKameResolver: true });

const index_arm64_js = build({
  rule: "kame",
  inputs: "src/index.ts",
  implicitInputs: moduleFilenames,
  output: builddir("bundles/index-arm64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "arm64",
  },
});

build({
  rule: "kame",
  inputs: "src/primordials.ts",
  implicitInputs: moduleFilenames,
  output: builddir("bundles/primordials-arm64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "arm64",
  },
});

const index_x86_64_js = build({
  rule: "kame",
  inputs: "src/index.ts",
  implicitInputs: moduleFilenames,
  output: builddir("bundles/index-x86_64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "x86_64",
  },
});

build({
  rule: "kame",
  inputs: "src/primordials.ts",
  implicitInputs: moduleFilenames,
  output: builddir("bundles/primordials-x86_64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "x86_64",
  },
});

if (process.arch === "arm64") {
  build({
    rule: "copy",
    inputs: [index_arm64_js],
    output: builddir("bundles/index.js"),
  });
} else {
  build({
    rule: "copy",
    inputs: [index_x86_64_js],
    output: builddir("bundles/index.js"),
  });
}

// so you can click-to-position in stack traces
build({
  rule: "copy",
  inputs: [builddir("bundles/index.js")],
  output: "yavascript-internal.js",
});
