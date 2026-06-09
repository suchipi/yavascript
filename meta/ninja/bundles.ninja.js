/// <reference types="@suchipi/shinobi/globals.d.ts" />
const { walkJsDeps } = require("../scripts/lib/walk");

const primordialsBase = build({
  rule: "kame",
  inputs: "src/primordials-base.ts",
  implicitInputs: walkJsDeps("src/primordials-base.ts", {
    useKameResolver: true,
  }),
  output: builddir("bundles/primordials-base.js"),
});

const primordialsWorker = build({
  rule: "kame",
  inputs: "src/primordials-worker.ts",
  implicitInputs: [
    primordialsBase,
    ...walkJsDeps("src/primordials-worker.ts", {
      useKameResolver: true,
    }),
  ],
  output: builddir("bundles/primordials-worker.js"),
});

const primordialsHardcodedDeps = walkJsDeps("src/primordials-hardcoded.ts", {
  useKameResolver: true,
});

const primordialsHardcodedArm64 = build({
  rule: "kame",
  inputs: "src/primordials-hardcoded.ts",
  implicitInputs: primordialsHardcodedDeps,
  output: builddir("bundles/primordials-hardcoded-arm64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "arm64",
  },
});

const primordialsHardcodedX86_64 = build({
  rule: "kame",
  inputs: "src/primordials-hardcoded.ts",
  implicitInputs: primordialsHardcodedDeps,
  output: builddir("bundles/primordials-hardcoded-x86_64.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: "x86_64",
  },
});

// For yavascript-bootstrap
const primordialsArm64 = build({
  rule: "combine",
  inputs: [primordialsBase, primordialsWorker, primordialsHardcodedArm64],
  output: builddir("bundles/primordials-arm64.js"),
});

const primordialsX86_64 = build({
  rule: "combine",
  inputs: [primordialsBase, primordialsWorker, primordialsHardcodedX86_64],
  output: builddir("bundles/primordials-x86_64.js"),
});

// For yavascript binary
const index = build({
  rule: "kame",
  inputs: "src/index.ts",
  implicitInputs: [
    primordialsBase,
    ...walkJsDeps("src/index.ts", { useKameResolver: true }),
  ],
  output: builddir("bundles/index.js"),
});

const indexArm64 = build({
  rule: "combine",
  inputs: [index, primordialsHardcodedArm64],
  output: builddir("bundles/index-arm64.js"),
});

const indexX86_64 = build({
  rule: "combine",
  inputs: [index, primordialsHardcodedX86_64],
  output: builddir("bundles/index-x86_64.js"),
});

// so you can click-to-position in stack traces
build({
  rule: "copy",
  inputs: [builddir("bundles/index.js")],
  output: "yavascript-internal.js",
});
