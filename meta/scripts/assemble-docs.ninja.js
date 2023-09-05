/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />
const path = require("path");

// to set location of .ninja_log
overrideDeclaration("builddir", "dist/docs");

const renderMd = rule("render-md", {
  command: `meta/scripts/render-md.js $in $out`,
});

for (const helpDoc of glob("src/**/*.help.md")) {
  const inputFile = helpDoc;
  const outputFile = path.join(
    "dist/docs",
    path.basename(helpDoc).replace(/\.help.md$/, ".term.txt")
  );

  build({
    output: outputFile,
    inputs: [inputFile],
    implicitInputs: ["meta/scripts/render-md.js"],
    rule: renderMd,
  });
}
