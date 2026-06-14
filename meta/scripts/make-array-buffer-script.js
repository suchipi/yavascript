#!/usr/bin/env node
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");

async function main() {
  const [inputFilePath, globalName, outputFilePath] = process.argv.slice(2);

  if (!inputFilePath || !globalName || !outputFilePath) {
    console.error(
      "Usage: meta/scripts/make-array-buffer-script.js <input-file-path> <global-name> <output-file-path>",
    );
    process.exit(2);
  }

  const inputSize = (await fsp.stat(inputFilePath)).size;

  const inputStream = fs.createReadStream(inputFilePath);
  const outputStream = fs.createWriteStream(outputFilePath);

  function writeAsync(stream, data) {
    return new Promise((resolve, reject) => {
      stream.write(data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  await writeAsync(
    outputStream,
    `globalThis[${JSON.stringify(globalName)}] = \x01${inputSize}\x02`,
  );

  await pipeline(inputStream, outputStream, { end: false });

  await writeAsync(outputStream, `\x03;\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
