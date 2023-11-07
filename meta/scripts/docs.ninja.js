/// <reference path="../../node_modules/@suchipi/shinobi/globals.d.ts" />
const path = require("path");

console.error("Finding help docs...");
const helpDocs = glob("src/**/*.help.md");
for (const helpDoc of helpDocs) {
  const inputFile = helpDoc;
  const outputFile = builddir(
    path.join("docs", path.basename(helpDoc).replace(/\.help.md$/, ".term.txt"))
  );

  build({
    output: outputFile,
    inputs: [inputFile],
    implicitInputs: implicitInputs["render-md"],
    rule: "render-md",
  });
}
