const fs = require("node:fs");
const { parseArgv, Path } = require("clef-parse");
const { mdtocs } = require("mdtocs");

const argv = parseArgv(process.argv.slice(2), {
  input: Path,
  output: Path,
});

if (!argv.options.input || !argv.options.output) {
  throw new Error("You have to specify --input [path] and --output [path]");
}

const inputPath = argv.options.input;
const outputPath = argv.options.output;

const inputContent = fs.readFileSync(inputPath.toString(), "utf-8");

const toc = mdtocs(inputContent);

fs.writeFileSync(outputPath.toString(), toc);
