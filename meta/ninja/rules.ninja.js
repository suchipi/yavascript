/// <reference types="@suchipi/shinobi/globals.d.ts" />
const path = require("path");
const { walkJsDeps } = require("../scripts/lib/walk");
const rootDir = require("../scripts/lib/root-dir");

rule("copy", {
  command: "cp -R $in $out",
  description: "COPY $out",
});

rule("md-to-term", {
  command: `node meta/scripts/md-to-term.js --input $in --output $out`,
  description: "MD-TO-TERM $out",
  implicitInputs: walkJsDeps("meta/scripts/md-to-term.js"),
});

// website stuff
{
  rule("md-to-html", {
    command: `npx --no-install mark-applier --raw --input $in --output $out`,
    description: "MD-TO-HTML $out",
    implicitInputs: [glob("node_modules/mark-applier/**/*")],
  });

  rule("wrap-html", {
    command: `node meta/scripts/wrap-html.js --input $in --output $out`,
    description: "WRAP-HTML $out",
  });

  rule("generate-css", {
    command: `npx --no-install mark-applier --css --output $out`,
    description: "GENERATE-CSS $out",
    implicitInputs: [glob("node_modules/mark-applier/**/*")],
  });
}

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
