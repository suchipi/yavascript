/// <reference types="@suchipi/shinobi/globals.d.ts" />
const { walkJsDeps } = require("../scripts/lib/walk");

const moduleFilenames = walkJsDeps("src/index.ts", { useKameResolver: true });

let ysArch;
switch (process.arch) {
  case "arm64": {
    ysArch = "arm64";
    break;
  }
  case "x64": {
    ysArch = "x86_64";
    break;
  }
  default: {
    throw new Error("Unhandled architecture: " + process.arch);
  }
}

const index_js = build({
  rule: "kame",
  inputs: "src/index.ts",
  implicitInputs: moduleFilenames,
  output: builddir("bundles/index.js"),
  ruleVariables: {
    YAVASCRIPT_ARCH: ysArch,
  },
});

// so you can click-to-position in stack traces
build({
  rule: "copy",
  inputs: [index_js],
  output: "yavascript-internal.js",
});
