#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(GitRepo.findRoot(__dirname));

for (const helpDoc of glob("src/**/*.help.md")) {
  const inputFile = helpDoc;
  const outputFile = Path.join(
    "dist/docs",
    basename(helpDoc).replace(/\.help.md$/, ".glow.txt")
  );
  exec(["meta/scripts/glow-render.ts", inputFile, outputFile]);
}
