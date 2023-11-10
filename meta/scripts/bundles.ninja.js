/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />
const { walk } = require("resolve-everything");
const rootDir = require("./root-dir");
const { resolve } = require("../../src/kame-config");

const entrypoint = rootDir("src/index.ts");

console.error("Walking JS module tree...");
const { errors, modules } = walk(entrypoint, {
  resolver: resolve,
  skip: /node_modules/g,
});

if (errors.length > 0) {
  throw Object.assign(new Error("module traversal errors occurred"), {
    errors,
  });
}

let moduleFilenames = Array.from(modules.keys())
  .map((filename) => filename.replace(/\?.*$/, ""))
  .map((filename) => rootDir.relative(filename))
  // TODO: there's a loop in the build where each subsequent build always
  // compiles the bundles. It seems to be because the bundles include
  // yavascript.d.ts, but I can't find a reason that yavascript.d.ts would
  // depend on the bundles. Omitting yavascript.d.ts from the bundle implicit
  // inputs avoids the issue, though. This does mean, though, that the data for
  // `yavascript --print-types` could be out of date unless it was a fresh build...
  // more investigation needed
  .filter((filename) => !filename.endsWith("yavascript.d.ts"));

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
