/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />

function program(programName, target, base, input) {
  build({
    rule: "make-program",
    inputs: [input],
    implicitInputs: implicitInputs["make-program"],
    ruleVariables: {
      TARGET: target,
      BASE: base,
    },
    output: builddir(
      `bin/${target}/${programName}${base.endsWith(".exe") ? ".exe" : ""}`
    ),
  });
}

// --- x86_64 binaries ---

program(
  "yavascript",
  "x86_64-apple-darwin",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-x86_64.bin"
);
program(
  "yavascript",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-x86_64.bin"
);
program(
  "yavascript",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-x86_64.bin"
);
program(
  "yavascript",
  "x86_64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-x86_64.bin"
);

// bytecode stuff wasn't working properly on windows; endianness?
program(
  "yavascript",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  "dist/bundles/index-x86_64.js"
);

// --- aarch64 binaries ---

program(
  "yavascript",
  "aarch64-apple-darwin",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-arm64.bin"
);
program(
  "yavascript",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-arm64.bin"
);
program(
  "yavascript",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-arm64.bin"
);
program(
  "yavascript",
  "aarch64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  "dist/bytecode/index-arm64.bin"
);

// --- yavascript-bootstrap ---
program(
  "yavascript-bootstrap",
  "x86_64-apple-darwin",
  "qjsbootstrap",
  "dist/bundles/primordials-x86_64.js"
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap",
  "dist/bundles/primordials-x86_64.js"
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap",
  "dist/bundles/primordials-x86_64.js"
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-static",
  "qjsbootstrap",
  "dist/bundles/primordials-x86_64.js"
);
program(
  "yavascript-bootstrap",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  "dist/bundles/primordials-x86_64.js"
);
program(
  "yavascript-bootstrap",
  "aarch64-apple-darwin",
  "qjsbootstrap",
  "dist/bundles/primordials-arm64.js"
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap",
  "dist/bundles/primordials-arm64.js"
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap",
  "dist/bundles/primordials-arm64.js"
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-static",
  "qjsbootstrap",
  "dist/bundles/primordials-arm64.js"
);

const platform = require("@suchipi/quickjs").identifyCurrentPlatform().name;
build({
  rule: "copy",
  inputs: [builddir(`bin/${platform}/yavascript`)],
  output: builddir("yavascript"),
});
