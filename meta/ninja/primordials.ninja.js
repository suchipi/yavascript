/// <reference types="@suchipi/shinobi/globals.d.ts" />
const { walkJsDeps } = require("../scripts/lib/walk");

{
  const primordials_base_js = build({
    rule: "kame",
    inputs: "src/entrypoints/primordials-base.ts",
    implicitInputs: walkJsDeps("src/entrypoints/primordials-base.ts", {
      useKameResolver: true,
    }),
    output: builddir("bundles/primordials-base.js"),
  });

  const primordials_base_bin = build({
    rule: "to-bytecode",
    inputs: [primordials_base_js],
    output: builddir("bytecode/primordials-base.bin"),
  });

  const primordials_base_bin_js = build({
    rule: "make-array-buffer-script",
    inputs: [primordials_base_bin],
    output: builddir("bytecode/primordials-base.bin.js"),
    ruleVariables: {
      GLOBAL_NAME: "__bytecode_primordials_base",
    },
  });

  exports.primordials_base_bin_js = primordials_base_bin_js;
}

const primordials_harcoded_deps = walkJsDeps(
  "src/entrypoints/primordials-hardcoded.ts",
  { useKameResolver: true },
);

{
  const primordials_hardcoded_arm64_js = build({
    rule: "kame",
    inputs: "src/entrypoints/primordials-hardcoded.ts",
    implicitInputs: primordials_harcoded_deps,
    output: builddir("bundles/primordials-hardcoded-arm64.js"),
    ruleVariables: {
      YAVASCRIPT_ARCH: "arm64",
    },
  });

  const primordials_hardcoded_arm64_bin = build({
    rule: "to-bytecode",
    inputs: [primordials_hardcoded_arm64_js],
    output: builddir("bundles/primordials-hardcoded-arm64.bin"),
  });

  const primordials_hardcoded_arm64_bin_js = build({
    rule: "make-array-buffer-script",
    inputs: [primordials_hardcoded_arm64_bin],
    output: builddir("bundles/primordials-hardcoded-arm64.bin.js"),
    ruleVariables: {
      GLOBAL_NAME: "__bytecode_primordials_hardcoded",
    },
  });

  exports.primordials_hardcoded_arm64_bin_js =
    primordials_hardcoded_arm64_bin_js;
}

{
  const primordials_hardcoded_x86_64_js = build({
    rule: "kame",
    inputs: "src/entrypoints/primordials-hardcoded.ts",
    implicitInputs: primordials_harcoded_deps,
    output: builddir("bundles/primordials-hardcoded-x86_64.js"),
    ruleVariables: {
      YAVASCRIPT_ARCH: "x86_64",
    },
  });

  const primordials_hardcoded_x86_64_bin = build({
    rule: "to-bytecode",
    inputs: [primordials_hardcoded_x86_64_js],
    output: builddir("bundles/primordials-hardcoded-x86_64.bin"),
  });

  const primordials_hardcoded_x86_64_bin_js = build({
    rule: "make-array-buffer-script",
    inputs: [primordials_hardcoded_x86_64_bin],
    output: builddir("bundles/primordials-hardcoded-x86_64.bin.js"),
    ruleVariables: {
      GLOBAL_NAME: "__bytecode_primordials_hardcoded",
    },
  });

  exports.primordials_hardcoded_x86_64_bin_js =
    primordials_hardcoded_x86_64_bin_js;
}
