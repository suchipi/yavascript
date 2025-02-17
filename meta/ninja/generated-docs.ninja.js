/// <reference types="@suchipi/shinobi/globals.d.ts" />
const path = require("path");

const dtsIncFiles = glob("src/**/*.inc.d.ts");
const quickjsDtsFiles = glob("node_modules/@suchipi/quickjs/build/dts/*");

for (const dtsFile of [...dtsIncFiles, ...quickjsDtsFiles]) {
  const inputFile = dtsFile;
  const outputFile = rel(
    "../generated-docs/" +
      path.basename(inputFile).replace(/\.inc\.d\.ts$/, ".md")
  );

  build({
    rule: "dtsmd",
    inputs: [inputFile],
    output: outputFile,
  });
}

const linkFooter = build({
  rule: "md-links-from-json5",
  inputs: [rel("../scripts/lib/generated-doc-links.json5")],
  output: builddir("docs/link-footer.md"),
});

build({
  rule: "combine",
  inputs: [rel("../scripts/lib/generated-doc-index.md"), linkFooter],
  output: rel("../generated-docs/README.md"),
});
