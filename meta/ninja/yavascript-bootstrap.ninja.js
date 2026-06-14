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

const yavascript_bootstrap_bundle_js = build({
  rule: "kame",
  inputs: "src/entrypoints/yavascript-bootstrap.ts",
  implicitInputs: walkJsDeps("src/entrypoints/yavascript-bootstrap.ts", {
    useKameResolver: true,
  }),
  output: builddir("bundles/yavascript-bootstrap-bundle.js"),
});

const yavascript_bootstrap_arm64_js = build({
  rule: "combine",
  inputs: [
    primordials_base_bin_js,
    primordials_hardcoded_arm64_bin_js,
    yavascript_bootstrap_bundle_js,
  ],
  output: builddir("bundles/yavascript-bootstrap-arm64.js"),
});

const yavascript_bootstrap_x86_64_js = build({
  rule: "combine",
  inputs: [
    primordials_base_bin_js,
    primordials_hardcoded_x86_64_bin_js,
    yavascript_bootstrap_bundle_js,
  ],
  output: builddir("bundles/yavascript-bootstrap-x86_64.js"),
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

program(
  "yavascript-bootstrap",
  "x86_64-apple-darwin",
  "qjsbootstrap",
  yavascript_bootstrap_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-static",
  "qjsbootstrap",
  yavascript_bootstrap_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap",
  yavascript_bootstrap_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap",
  yavascript_bootstrap_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-freebsd-15",
  "qjsbootstrap",
  yavascript_bootstrap_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  yavascript_bootstrap_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-apple-darwin",
  "qjsbootstrap",
  yavascript_bootstrap_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-static",
  "qjsbootstrap",
  yavascript_bootstrap_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap",
  yavascript_bootstrap_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap",
  yavascript_bootstrap_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-freebsd-15",
  "qjsbootstrap",
  yavascript_bootstrap_arm64_js,
);

const qjsPlatform = require("@suchipi/quickjs").identifyCurrentPlatform();
build({
  rule: "copy",
  inputs: [
    builddir(
      `bin/${qjsPlatform.name}/yavascript-bootstrap${qjsPlatform.programSuffix}`,
    ),
  ],
  output: builddir("yavascript-bootstrap" + qjsPlatform.programSuffix),
});
