#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const globby = require("globby");
const macaroni = require("@suchipi/macaroni");
const prettier = require("prettier");

// go to root dir
cd(path.resolve(__dirname, "..", ".."));

fs.mkdirSync("dist", { recursive: true });

const dtsFolderPaths = new Set();
globby.sync("./src/**/*.inc.d.ts").forEach((path) => {
  dtsFolderPaths.add(path.dirname(path));
});

const includePaths = [
  ...dtsFolderPaths,
  "src/templates",
  // NOTE: architecture doesn't actually matter here, as the dts files are always the same
  "node_modules/@suchipi/quickjs/build/aarch64-apple-darwin/dts",
];

const includeRule = macaroni.makeIncludeRule(includePaths);

function macaroni(inputPath, outputPath) {
  const result = macaroni.process(inputPath, { rules: [includeRule] });
  fs.writeFileSync(outputPath, result);
}

function prettier(targetPath) {
  child_process.execSync(`npx prettier --write ${quote(targetPath)}`);
}

macaroni("src/templates/yavascript.d.ts.tmpl", "dist/yavascript.d.ts");
prettier("dist/yavascript.d.ts");

macaroni("src/templates/yavascript-git.d.ts.tmpl", "yavascript.d.ts");
prettier("yavascript.d.ts");

// copy into npm folder
fs.copyFileSync("dist/yavascript.d.ts", "meta/npm/yavascript.d.ts");
