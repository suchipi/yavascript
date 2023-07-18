#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(GitRepo.findRoot(__dirname));

ensureDir("dist");

const dtsFolderPaths = new Set<string>();
glob("./src/**/*.inc.d.ts").forEach((path) => {
  dtsFolderPaths.add(dirname(path));
});

const includePaths = [
  ...dtsFolderPaths,
  "src/templates",
  // NOTE: architecture doesn't actually matter here, as the dts files are always the same
  "node_modules/@suchipi/quickjs/build/aarch64-apple-darwin/dts",
];

function macaroni(inputPath: string, outputPath: string) {
  const result = $(
    `npx @suchipi/macaroni --include-paths ${quote(
      includePaths.join(",")
    )} ${inputPath}`
  );
  writeFile(outputPath, result.stdout);
}

function prettier(targetPath: string) {
  exec(`npx prettier --write ${quote(targetPath)}`);
}

macaroni("src/templates/yavascript.d.ts.tmpl", "dist/yavascript.d.ts");
prettier("dist/yavascript.d.ts");

macaroni("src/templates/yavascript-git.d.ts.tmpl", "yavascript.d.ts");
prettier("yavascript.d.ts");

// copy into npm folder
copy("dist/yavascript.d.ts", "meta/npm/yavascript.d.ts", {
  whenTargetExists: "overwrite",
});
