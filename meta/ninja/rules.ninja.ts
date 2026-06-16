/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />
import path from "path";
import { walkJsDeps } from "../scripts/lib/walk.js";
import rootDir from "../root-dir.js";

export const copy = rule("copy", {
  command: "cp -R $in $out",
  description: "COPY $out",
});

/** NOTE: must define YAVASCRIPT_ARCH */
export const kame = rule("kame", {
  command: [
    `env YAVASCRIPT_ARCH=$YAVASCRIPT_ARCH npx --no-install kame bundle`,
    `--config ./meta/kame/kame-config.js`,
    `--input $in`,
    `--output $out`,
  ],
  description: "KAME BUNDLE $out",
  implicitInputs: ["meta/kame/kame-config.js"],
});

// to-bytecode rule
const {
  buildArtifactsLocation,
  identifyCurrentPlatform,
} = require("@suchipi/quickjs");

const quickjsBinsPath = path.join(
  buildArtifactsLocation(),
  identifyCurrentPlatform().name,
  "bin",
);

const quickjsBinsPathRel = path.relative(process.cwd(), quickjsBinsPath);

const quickjsRunBinPath =
  path.join(quickjsBinsPathRel, "quickjs-run") +
  (process.platform === "win32" ? ".exe" : "");
const fileToByteCodePath = path.join(quickjsBinsPathRel, "file-to-bytecode.js");

export const toByteCode = rule("to-bytecode", {
  command: [
    JSON.stringify(quickjsRunBinPath),
    JSON.stringify(fileToByteCodePath),
    `$in $out`,
    // to have clearer stack trace in filenames
    `yavascript-internals/$in`,
    "--strip",
    "source",
  ],
  description: "TO-BYTECODE $out",
  implicitInputs: [quickjsRunBinPath, fileToByteCodePath],
});

/** NOTE: must define TARGET and BASE */
export const makeProgram = rule("make-program", {
  command: [
    "cat node_modules/@suchipi/quickjs/build/$TARGET/bin/$BASE $in",
    "> $out",
    "&& chmod +x $out",
  ],
  description: "MAKE-PROGRAM $out",
  implicitInputs: glob(
    "node_modules/@suchipi/quickjs/build/**/*",
    // TODO: shinobi type is incorrect; this should be optional
    {},
  ),
});

/** NOTE: must define INCLUDE_PATHS */
export const macaroni = rule("macaroni", {
  command:
    "npx --no-install macaroni --include-paths $INCLUDE_PATHS $in > $out",
  description: "MACARONI $out",
  implicitInputs: [`node_modules/@suchipi/macaroni/dist/cli.js`],
});

export const prettier = rule("prettier", {
  command: "npx --no-install prettier $PRETTIER_FLAGS $in > $out",
  description: "PRETTIER $out",
  implicitInputs: [`node_modules/prettier/bin/prettier.cjs`],
});

const docLinksFile = rel("../scripts/lib/generated-doc-links.json5");
export const dtsmd = rule("dtsmd", {
  command: `npx --no-install dtsmd --links-file ${JSON.stringify(
    docLinksFile,
  )} $in > $out`,
  description: "DTSMD $out",
  implicitInputs: [`node_modules/@suchipi/dtsmd/dist/cli.js`, docLinksFile],
});

export const mdLinksFromJson5 = rule("md-links-from-json5", {
  command: `node meta/scripts/md-links-from-json5.js $in $out`,
  description: "MD-LINKS-FROM-JSON5 $out",
  implicitInputs: walkJsDeps("meta/scripts/md-links-from-json5.js"),
});

export const markdownToc = rule("markdown-toc", {
  command: `node meta/scripts/markdown-toc.js --input $in --output $out`,
  description: "MD-TOC $out",
  implicitInputs: walkJsDeps("meta/scripts/markdown-toc.js"),
});

export const combine = rule("combine", {
  command: `cat $in > $out`,
  description: "COMBINE $out",
});

export const minifyJs = rule("minify-js", {
  command: `npx --no-install terser $in $TERSER_OPTIONS -o $out`,
  description: "TERSER $out",
  implicitInputs: [rootDir("node_modules/terser/package.json")],
});

/** NOTE: must define GLOBAL_NAME */
export const makeArrayBufferScript = rule("make-array-buffer-script", {
  command:
    "node meta/scripts/make-array-buffer-script.js $in $GLOBAL_NAME $out",
  description: "MAKE-ARRAY-BUFFER-SCRIPT $out",
  implicitInputs: walkJsDeps("meta/scripts/make-array-buffer-script.js"),
});
