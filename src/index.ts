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
import printSrcTarget from "./targets/print-src";

import parseArgv from "./parse-argv";

function main() {
  const { flags, positionalArgs } = parseArgv(scriptArgs);

  // Only do these if there's no positional args, so that they can override
  // what these flags mean in their own scripts.
  if (positionalArgs.length == 0) {
    if (flags.help) {
      helpTarget();
      return;
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
        return;
      }
    } else if (flags.version) {
      versionTarget();
      return;
    } else if (flags.license) {
      licenseTarget();
      return;
    } else if (flags.printTypes) {
      printTypesTarget();
      return;
    } else if (flags.printSrc) {
      printSrcTarget();
      return;
    }
  }

  const fileToRun = positionalArgs[0];
  if (fileToRun == null) {
    let lang = flags.lang ?? "javascript";
    replTarget(lang);
  } else {
    runFileTarget(fileToRun, flags.lang || null);
  }
}

try {
  main();
} catch (err) {
  printError(err, std.err);
  std.exit(1);
}
