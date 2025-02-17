/// <reference types="@suchipi/shinobi/globals.d.ts" />
const path = require("path");

const dtsFiles = glob("src/**/*.inc.d.ts");
for (const dtsFile of dtsFiles) {
  const inputFile = dtsFile;
  const outputFile = rel(
    "../generated-docs/" +
      path.basename(inputFile).replace(/\.inc\.d\.ts$/, ".md")
  );

  build({
    output: outputFile,
    inputs: [inputFile],
    rule: "dtsmd",
  });
}
