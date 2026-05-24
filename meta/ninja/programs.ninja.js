/// <reference types="@suchipi/shinobi/globals.d.ts" />

function program(programName, target, base, input) {
  build({
    rule: "make-program",
    inputs: [input],
    ruleVariables: {
      TARGET: target,
      BASE: base,
    },
    output: builddir(
      `bin/${target}/${programName}${base.endsWith(".exe") ? ".exe" : ""}`,
    ),
  });
}

// --- x86_64 binaries ---

program(
  "yavascript",
  "x86_64-apple-darwin",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-x86_64.bin"),
);
program(
  "yavascript",
  "x86_64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-x86_64.bin"),
);
program(
  "yavascript",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-x86_64.bin"),
);
program(
  "yavascript",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-x86_64.bin"),
);
program(
  "yavascript",
  "x86_64-unknown-freebsd-15",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-x86_64.bin"),
);

// bytecode stuff wasn't working properly on windows; endianness?
// from future Lily: probably because Worker-related atoms weren't present. atom
// values are consistent now, so this might work again; try later.
program(
  "yavascript",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  builddir("bundles/index-x86_64.js"),
);

// --- aarch64 binaries ---

program(
  "yavascript",
  "aarch64-apple-darwin",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-arm64.bin"),
);
program(
  "yavascript",
  "aarch64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-arm64.bin"),
);
program(
  "yavascript",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-arm64.bin"),
);
program(
  "yavascript",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-arm64.bin"),
);
program(
  "yavascript",
  "aarch64-unknown-freebsd-15",
  "qjsbootstrap-bytecode",
  builddir("bytecode/index-arm64.bin"),
);

// --- yavascript-bootstrap ---
program(
  "yavascript-bootstrap",
  "x86_64-apple-darwin",
  "qjsbootstrap",
  builddir("bundles/primordials-x86_64.js"),
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-static",
  "qjsbootstrap",
  builddir("bundles/primordials-x86_64.js"),
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap",
  builddir("bundles/primordials-x86_64.js"),
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap",
  builddir("bundles/primordials-x86_64.js"),
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-freebsd-15",
  "qjsbootstrap",
  builddir("bundles/primordials-x86_64.js"),
);
program(
  "yavascript-bootstrap",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  builddir("bundles/primordials-x86_64.js"),
);
program(
  "yavascript-bootstrap",
  "aarch64-apple-darwin",
  "qjsbootstrap",
  builddir("bundles/primordials-arm64.js"),
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-static",
  "qjsbootstrap",
  builddir("bundles/primordials-arm64.js"),
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap",
  builddir("bundles/primordials-arm64.js"),
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap",
  builddir("bundles/primordials-arm64.js"),
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-freebsd-15",
  "qjsbootstrap",
  builddir("bundles/primordials-arm64.js"),
);

const qjsPlatform = require("@suchipi/quickjs").identifyCurrentPlatform();
build({
  rule: "copy",
  inputs: [
    builddir(`bin/${qjsPlatform.name}/yavascript${qjsPlatform.programSuffix}`),
  ],
  output: builddir("yavascript" + qjsPlatform.programSuffix),
});
build({
  rule: "copy",
  inputs: [
    builddir(
      `bin/${qjsPlatform.name}/yavascript-bootstrap${qjsPlatform.programSuffix}`,
    ),
  ],
  output: builddir("yavascript-bootstrap" + qjsPlatform.programSuffix),
});
