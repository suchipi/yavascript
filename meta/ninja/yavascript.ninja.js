/// <reference types="@suchipi/shinobi/globals.d.ts" />
const { walkJsDeps } = require("../scripts/lib/walk");
const {
  primordials_base_bin_js,
  primordials_hardcoded_arm64_bin_js,
  primordials_hardcoded_x86_64_bin_js,
} = require("./primordials.ninja");

// ===================
// ===== Bundles =====
// ===================

const yavascript_bundle_js = build({
  rule: "kame",
  inputs: "src/entrypoints/yavascript.ts",
  implicitInputs: walkJsDeps("src/entrypoints/yavascript.ts", {
    useKameResolver: true,
  }),
  output: builddir("bundles/yavascript-bundle.js"),
});

const yavascript_arm64_js = build({
  rule: "combine",
  inputs: [
    primordials_base_bin_js,
    primordials_hardcoded_arm64_bin_js,
    yavascript_bundle_js,
  ],
  output: builddir("bundles/yavascript-arm64.js"),
});

const yavascript_x86_64_js = build({
  rule: "combine",
  inputs: [
    primordials_base_bin_js,
    primordials_hardcoded_x86_64_bin_js,
    yavascript_bundle_js,
  ],
  output: builddir("bundles/yavascript-x86_64.js"),
});

// ====================
// ===== Bytecode =====
// ====================

const yavascript_arm64_bin = build({
  rule: "to-bytecode",
  inputs: [yavascript_arm64_js],
  output: builddir("bytecode/yavascript-arm64.bin"),
});

const yavascript_x86_64_bin = build({
  rule: "to-bytecode",
  inputs: [yavascript_x86_64_js],
  output: builddir("bytecode/yavascript-x86_64.bin"),
});

// ====================
// ===== Binaries =====
// ====================

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
  yavascript_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  yavascript_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  yavascript_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  yavascript_x86_64_bin,
);
program(
  "yavascript",
  "x86_64-unknown-freebsd-15",
  "qjsbootstrap-bytecode",
  yavascript_x86_64_bin,
);

// bytecode stuff not working properly on windows. not sure why.
program(
  "yavascript",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  yavascript_x86_64_js,
);

// --- aarch64 binaries ---

program(
  "yavascript",
  "aarch64-apple-darwin",
  "qjsbootstrap-bytecode",
  yavascript_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-linux-static",
  "qjsbootstrap-bytecode",
  yavascript_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap-bytecode",
  yavascript_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap-bytecode",
  yavascript_arm64_bin,
);
program(
  "yavascript",
  "aarch64-unknown-freebsd-15",
  "qjsbootstrap-bytecode",
  yavascript_arm64_bin,
);

const qjsPlatform = require("@suchipi/quickjs").identifyCurrentPlatform();
build({
  rule: "copy",
  inputs: [
    builddir(`bin/${qjsPlatform.name}/yavascript${qjsPlatform.programSuffix}`),
  ],
  output: builddir("yavascript" + qjsPlatform.programSuffix),
});
