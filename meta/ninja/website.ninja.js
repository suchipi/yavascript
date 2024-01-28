/// <reference types="@suchipi/shinobi/globals.d.ts" />
const path = require("path");

function mdToHtml(namespace, inputPath, outputPath) {
  const intermediatePath = builddir(
    path.join(
      "intermediates",
      namespace,
      path.basename(inputPath).replace(/.md$/, ".html")
    )
  );

  build({
    output: intermediatePath,
    inputs: [inputPath],
    rule: "md-to-html",
  });

  build({
    output: outputPath,
    inputs: [intermediatePath],
    rule: "wrap-html",
  });
}

const helpDocs = glob("src/**/*.help.md");
for (const helpDoc of helpDocs) {
  const outputFile = builddir(
    path.join(
      "website/docs",
      path.basename(helpDoc).replace(/\.help.md$/, ".html")
    )
  );

  mdToHtml("website/helpDocs", helpDoc, outputFile);
}

const pages = glob("meta/website/pages/**/*.md");
for (const page of pages) {
  const outputFile = builddir(
    path.join(
      "website",
      page.replace(/^meta\/website\/pages/, "").replace(/\.md$/, ".html")
    )
  );

  mdToHtml("website/pages", page, outputFile);
}

build({
  rule: "generate-css",
  inputs: [],
  output: builddir("website/styles.css"),
});
