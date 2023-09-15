#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const globby = require("globby");
const macaroni = require("@suchipi/macaroni");

// go to root dir
process.chdir(path.resolve(__dirname, "..", ".."));

fs.mkdirSync("dist", { recursive: true });

const dtsFolderPaths = new Set();
globby.sync("./src/**/*.inc.d.ts").forEach((match) => {
  dtsFolderPaths.add(path.dirname(path.resolve(process.cwd(), match)));
});

const includePaths = [
  ...dtsFolderPaths,
  path.resolve(process.cwd(), "src/templates"),
  path.resolve(
    process.cwd(),
    // NOTE: architecture doesn't actually matter here, as the dts files are always the same
    "node_modules/@suchipi/quickjs/build/dts"
  ),
];

const includeRule = macaroni.makeIncludeRule(includePaths);

function doMacaroni(inputPath, outputPath) {
  const absoluteInputPath = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(process.cwd(), inputPath);

  const result = macaroni.process(absoluteInputPath, { rules: [includeRule] });
  fs.writeFileSync(outputPath, result);
}

function doPrettier(targetPath) {
  child_process.execSync(`npx prettier --write ${JSON.stringify(targetPath)}`);
}

doMacaroni("src/templates/yavascript.d.ts.tmpl", "dist/yavascript.d.ts");
doPrettier("dist/yavascript.d.ts");

doMacaroni("src/templates/yavascript-git.d.ts.tmpl", "yavascript.d.ts");
doPrettier("yavascript.d.ts");

// copy into npm folder
fs.copyFileSync("dist/yavascript.d.ts", "meta/npm/yavascript.d.ts");
