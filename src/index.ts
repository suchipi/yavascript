import * as std from "std";
import printError from "./print-error";

import { installApi } from "./api";
installApi(globalThis);

import helpTarget from "./targets/help";
import versionTarget from "./targets/version";
import licenseTarget from "./targets/license";
import runFileTarget from "./targets/run-file";
import evalTarget from "./targets/eval";
import replTarget from "./targets/repl";

function main() {
  if (scriptArgs.includes("-h") || scriptArgs.includes("--help")) {
    helpTarget();
  } else if (scriptArgs.includes("-e") || scriptArgs.includes("--eval")) {
    let codeToRun: string | null = null;
    for (let i = 0; i < scriptArgs.length; i++) {
      const arg = scriptArgs[i];
      if (arg === "-e" || arg === "--eval") {
        codeToRun = scriptArgs[i + 1];
      }
    }

    if (codeToRun == null) {
      std.err.puts(
        `Please specify the code string to run. For example: ${scriptArgs[0]} -e 'echo("hi")'\nFor more info, run ${scriptArgs[0]} --help.`
      );
      std.exit(1);
    } else {
      evalTarget(codeToRun);
    }
  } else if (
    scriptArgs.includes("-v") ||
    scriptArgs.includes("--version") ||
    scriptArgs.includes("-version")
  ) {
    versionTarget();
    return;
  } else if (scriptArgs.includes("--license")) {
    licenseTarget();
  } else {
    const fileToRun = scriptArgs[1];

    if (fileToRun == null) {
      replTarget();
    } else {
      runFileTarget(fileToRun);
    }
  }
}

try {
  main();
} catch (err) {
  printError(err, std.err);
  std.exit(1);
}
