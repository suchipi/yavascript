/// <reference types="@suchipi/shinobi/globals.d.ts" />
const path = require("path");
const { walkJsDeps } = require("../scripts/lib/walk");

rule("copy", {
  command: "cp -R $in $out",
  description: "COPY $out",
});

rule("render-md", {
  command: `node meta/scripts/render-md.js $in $out`,
  description: "RENDER-MD $out",
  implicitInputs: walkJsDeps("meta/scripts/render-md.js"),
});

// NOTE: must define YAVASCRIPT_ARCH
rule("kame", {
  command: [
    `env YAVASCRIPT_ARCH=$YAVASCRIPT_ARCH npx --no-install kame bundle`,
    `--resolver ./src/kame-config.js`,
    `--loader ./src/kame-config.js`,
    `--input $in`,
    `--output $out`,
  ],
  description: "KAME BUNDLE $out",
  implicitInputs: ["src/kame-config.js"],
});

// to-bytecode rule
{
  const {
    buildArtifactsLocation,
    identifyCurrentPlatform,
  } = require("@suchipi/quickjs");

  const quickjsBinsPath = path.join(
    buildArtifactsLocation(),
    identifyCurrentPlatform().name,
    "bin"
  );

  const quickjsBinsPathRel = path.relative(process.cwd(), quickjsBinsPath);

  const quickjsRunBinPath =
    path.join(quickjsBinsPathRel, "quickjs-run") +
    (process.platform === "win32" ? ".exe" : "");
  const fileToByteCodePath = path.join(
    quickjsBinsPathRel,
    "file-to-bytecode.js"
  );

  rule("to-bytecode", {
    command: [
      JSON.stringify(quickjsRunBinPath),
      JSON.stringify(fileToByteCodePath),
      `$in $out`,
      // to have clearer stack trace in filenames
      `yavascript-internal.js`,
    ],
    description: "TO-BYTECODE $out",
    implicitInputs: [quickjsRunBinPath, fileToByteCodePath],
  });
}

// NOTE: must define NAME
rule("binary-to-c-array", {
  command: `xxd -i -n $NAME $in > $out`,
  description: "BIN2C $out",
});

// cc rule
{
  rule("cc", {
    command: `cc -Inode_modules/@suchipi/quickjs/build/aarch64-apple-darwin/include $in -o $out`,
    description: "CC $out",
  });
}

// NOTE: must define TARGET and BASE
rule("make-program", {
  command: [
    "cat node_modules/@suchipi/quickjs/build/$TARGET/bin/$BASE $in",
    "> $out",
    "&& chmod +x $out",
  ],
  description: "MAKE-PROGRAM $out",
  implicitInputs: glob("node_modules/@suchipi/quickjs/build/**/*"),
});

// NOTE: must define INCLUDE_PATHS
rule("macaroni", {
  command:
    "npx --no-install macaroni --include-paths $INCLUDE_PATHS $in > $out",
  description: "MACARONI $out",
  implicitInputs: [`node_modules/@suchipi/macaroni/dist/cli.js`],
});

rule("prettier", {
  command: "npx --no-install prettier $in > $out",
  description: "PRETTIER $out",
  implicitInputs: [`node_modules/prettier/bin-prettier.js`],
});
