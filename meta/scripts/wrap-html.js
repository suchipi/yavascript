#!/usr/bin/env node
const fs = require("fs");
const clefairy = require("clefairy");
const Handlebars = require("handlebars");
const rootDir = require("./lib/root-dir");

clefairy.run(
  {
    input: clefairy.requiredPath,
    output: clefairy.optionalPath,
  },
  async function main({ input, output }) {
    const tmplContent = fs.readFileSync(
      rootDir("meta/website/layout.tmpl.html"),
      "utf-8"
    );
    const tmplFunction = Handlebars.compile(tmplContent);

    const inputContent = fs.readFileSync(input, "utf-8");

    const rendered = tmplFunction({
      title: "placeholder title",
      navContent: "placeholder nav content",
      mainContent: inputContent,
    });

    if (output) {
      fs.writeFileSync(output, rendered, "utf-8");
    } else {
      console.log(rendered);
    }
  }
);
