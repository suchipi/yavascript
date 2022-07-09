import * as std from "std";
import "./console-patch";
import * as api from "./api";

if (scriptArgs.length < 2) {
  std.err.puts(
    `Please specify a file to run. For example: ${scriptArgs[0]} ./my-script.js\n`
  );
  std.exit(1);
}

Object.assign(globalThis, api);

const targetFile = scriptArgs[1];

std.importModule(targetFile, "./<cwd>");
