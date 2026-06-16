/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />

import {
  layer5b_arm64_bin,
  layer5b_x86_64_bin,
  layer5b_x86_64_js,
} from "./layer5b.ninja.ts";

// ====================
// ===== Binaries =====
// ====================

function program(
  programName: string,
  target: string,
  base: string,
  input: string,
) {
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
  layer5b_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  layer5b_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  layer5b_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  layer5b_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-freebsd-15",
  "qjsbootstrap-bytecode",
  layer5b_x86_64_bin,
);

// bytecode stuff not working properly on windows. not sure why.
program(
  "yavascript",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  layer5b_x86_64_js,
);

// --- aarch64 binaries ---

program(
  "yavascript",
  "aarch64-apple-darwin",
  "qjsbootstrap-bytecode",
  layer5b_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  layer5b_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  layer5b_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  layer5b_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-freebsd-15",
  "qjsbootstrap-bytecode",
  layer5b_arm64_bin,
);

const qjsPlatform = require("@suchipi/quickjs").identifyCurrentPlatform();
build({
  rule: "copy",
  inputs: [
    builddir(`bin/${qjsPlatform.name}/yavascript${qjsPlatform.programSuffix}`),
  ],
  output: builddir("yavascript" + qjsPlatform.programSuffix),
});
