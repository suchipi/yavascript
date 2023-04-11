#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

const { args } = parseScriptArgs();
const here = pwd();

let [inputPath, outputPath] = args;

if (!inputPath || !outputPath) {
  throw new Error(
    "This script requires two arguments: the input file path and the output file path."
  );
}

inputPath = Path.resolve(inputPath);
outputPath = Path.resolve(outputPath);

if (!inputPath.startsWith(here) || !outputPath.startsWith(here)) {
  throw new Error(
    "In order to support docker volume mounts, this script cannot operate on files outside of its $PWD."
  );
}

let cmd: string;
if (env.YS_GLOW_METHOD === "docker") {
  const image = "charmcli/glow:v1.5.0";
  cmd = `docker run --rm -v ${here}:${here} ${image}`;
} else {
  cmd = `glow`;
}

// Need to manually specify a style ('dark' in this case) to force color
// output when the output isn't a tty.
const result = $(`${cmd} -s dark ${quote(inputPath)}`);
writeFile(outputPath, result.stdout);

echo(outputPath);
