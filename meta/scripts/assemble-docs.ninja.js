/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />
const path = require("path");

// to set location of .ninja_log
overrideDeclaration("builddir", "dist/docs");

const glowRender = rule("glow-render", {
  command: `meta/scripts/glow-render.ts $in $out`,
});

for (const helpDoc of glob("src/**/*.help.md")) {
  const inputFile = helpDoc;
  const outputFile = path.join(
    "dist/docs",
    path.basename(helpDoc).replace(/\.help.md$/, ".glow.txt")
  );

  build({
    output: outputFile,
    inputs: [inputFile],
    rule: glowRender,
  });
}
