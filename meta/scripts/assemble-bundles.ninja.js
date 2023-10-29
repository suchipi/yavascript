/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />
const { walk } = require("resolve-everything");
const rootDir = require("./root-dir");
const { resolve } = require("../../src/kame-config");

const entrypoint = rootDir("src/index.ts");

const { errors, modules } = walk(entrypoint, {
  resolver: resolve,
  skip: /node_modules/g,
});

if (errors.length > 0) {
  throw Object.assign(new Error("module traversal errors occurred"), {
    errors,
  });
}

const moduleFilenames = Array.from(modules.keys()).map((filename) =>
  filename.replace(/\?.*$/, "")
);

overrideDeclaration("builddir", "dist/bundles");

const kameRule = rule("kame", {
  command: [
    `npx --no-install kame bundle`,
    `--resolver ./src/kame-config.js`,
    `--loader ./src/kame-config.js`,
    `--input $in`,
    `--output $out`,
  ],
  description: "KAME BUNDLE $out",
});

build({
  rule: kameRule,
  inputs: rootDir("src/index.ts"),
  implicitInputs: moduleFilenames,
  output: builddir("index.js"),
});

build({
  rule: kameRule,
  inputs: rootDir("src/primordials.ts"),
  implicitInputs: moduleFilenames,
  output: builddir("primordials.js"),
});
