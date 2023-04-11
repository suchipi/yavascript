#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(GitRepo.findRoot(__dirname));

for (const helpDoc of glob("meta/docs/*.md")) {
  const inputFile = helpDoc;
  const outputFile = Path.join(
    "meta/docs/compiled",
    basename(helpDoc).replace(/\.md$/, ".glow.txt")
  );
  exec(["meta/scripts/glow-render.ts", inputFile, outputFile]);
}
