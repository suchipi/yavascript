const fs = require("node:fs");
const JSON5 = require("json5");

const inputPath = process.argv[2];
const outputPath = process.argv[3];

const docLinksStr = fs.readFileSync(inputPath, "utf-8");
const docLinks = JSON5.parse(docLinksStr);

const writeStream = fs.createWriteStream(outputPath, "utf-8");

writeStream.write("\n");

for (const [name, url] of Object.entries(docLinks)) {
  writeStream.write(`[\`${name}\`]: ${url}\n`);
}

writeStream.close();
