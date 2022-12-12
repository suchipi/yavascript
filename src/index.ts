import * as std from "std";
import printError from "./print-error";

import "./primordials";

import helpTarget from "./targets/help";
import versionTarget from "./targets/version";
import licenseTarget from "./targets/license";
import runFileTarget from "./targets/run-file";
import evalTarget from "./targets/eval";
import replTarget from "./targets/repl";
import printTypesTarget from "./targets/print-types";

import parseArgv from "./parse-argv";

function main() {
  const { flags, positionalArgs } = parseArgv(scriptArgs);

  if (flags.help) {
    helpTarget();
  } else if (typeof flags.eval !== "undefined") {
    let inputCode: string | null = flags.eval;
    let lang = flags.lang ?? "javascript";

    if (inputCode == null) {
      std.err.puts(
        `Please specify the code string to run. For example: ${scriptArgs[0]} -e 'echo("hi")'\nFor more info, run ${scriptArgs[0]} --help.`
      );
      std.exit(1);
    } else {
      evalTarget(inputCode, lang);
    }
  } else if (flags.version) {
    versionTarget();
    return;
  } else if (flags.license) {
    licenseTarget();
  } else if (flags.printTypes) {
    printTypesTarget();
  } else {
    const fileToRun = positionalArgs[0];

    if (fileToRun == null) {
      let lang = flags.lang ?? "javascript";
      replTarget(lang);
    } else {
      runFileTarget(fileToRun, flags.lang || null);
    }
  }
}

try {
  main();
} catch (err) {
  printError(err, std.err);
  std.exit(1);
}
