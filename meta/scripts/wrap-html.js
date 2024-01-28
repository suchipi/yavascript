#!/usr/bin/env node
const fs = require("fs");
const Handlebars = require("handlebars");
const rootDir = require("./lib/root-dir");

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath) {
  throw new Error(
    "This script requires 1-2 arguments: the input file path and (optionally) the output file path."
  );
}

const tmplContent = fs.readFileSync(
  rootDir("meta/website/layout.tmpl.html"),
  "utf-8"
);
const tmplFunction = Handlebars.compile(tmplContent);

const inputContent = fs.readFileSync(inputPath, "utf-8");

const rendered = tmplFunction({
  title: "placeholder title",
  navContent: "placeholder nav content",
  mainContent: inputContent,
});

if (outputPath) {
  fs.writeFileSync(outputPath, rendered, "utf-8");
} else {
  console.log(rendered);
}
