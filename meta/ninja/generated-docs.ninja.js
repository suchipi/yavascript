/// <reference types="@suchipi/shinobi/globals.d.ts" />
const path = require("path");

const dtsIncFiles = glob("src/**/*.inc.d.ts");

const newlineFile = rel("../scripts/lib/newline.txt");

function dtsToMd(
  inputFile,
  outputFile,
  name = path.basename(inputFile).replace(/(?:\.inc)?\.d\.ts$/, "")
) {
  const mdWithoutToc = build({
    rule: "dtsmd",
    inputs: [inputFile],
    output: builddir(`docs/${name}-no-toc.md`),
  });

  const toc = build({
    rule: "markdown-toc",
    inputs: [mdWithoutToc],
    output: builddir(`docs/${name}-toc.md`),
  });

  const combined = build({
    rule: "combine",
    inputs: [toc, newlineFile, mdWithoutToc],
    output: builddir(`docs/${name}-combined.md`),
  });

  build({
    rule: "prettier",
    ruleVariables: {
      PRETTIER_FLAGS: "--parser markdown",
    },
    inputs: [combined],
    output: outputFile,
  });
}

for (const dtsFile of dtsIncFiles) {
  const inputFile = dtsFile;
  const outputFile = rel(
    "../generated-docs/" +
      path.basename(inputFile).replace(/\.inc\.d\.ts$/, ".md")
  );

  dtsToMd(inputFile, outputFile);
}

const quickjsDtsFilesMap = {
  inspect: "node_modules/@suchipi/quickjs/build/dts/quickjs-inspect.d.ts",
  intervals: "node_modules/@suchipi/quickjs/build/dts/quickjs-intervals.d.ts",
  bytecode: "node_modules/@suchipi/quickjs/build/dts/quickjs-libbytecode.d.ts",
  libc: "node_modules/@suchipi/quickjs/build/dts/quickjs-libc.d.ts",
  // skipping libcontext as child contexts don't yet have a way to get yavascript globals
  encoding: "node_modules/@suchipi/quickjs/build/dts/quickjs-libencoding.d.ts",
  engine: "node_modules/@suchipi/quickjs/build/dts/quickjs-libengine.d.ts",
  // skipping libpointer
  modulesys: "node_modules/@suchipi/quickjs/build/dts/quickjs-modulesys.d.ts",
  // skipping print as we redefine it
  "quickjs-extensions": "node_modules/@suchipi/quickjs/build/dts/quickjs.d.ts",
};

for (const [outputName, quickjsDtsPath] of Object.entries(quickjsDtsFilesMap)) {
  const inputFile = quickjsDtsPath;
  const outputFile = rel(`../generated-docs/${outputName}.md`);

  dtsToMd(inputFile, outputFile, outputName);
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
