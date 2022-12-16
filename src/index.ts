import * as std from "std";
import printError from "./print-error";

import "./primordials";

import evalTarget from "./targets/eval";
import helpTarget from "./targets/help";
import invalidTarget from "./targets/invalid";
import licenseTarget from "./targets/license";
import printSrcTarget from "./targets/print-src";
import printTypesTarget from "./targets/print-types";
import replTarget from "./targets/repl";
import runFileTarget from "./targets/run-file";
import versionTarget from "./targets/version";

import parseArgv from "./parse-argv";

function main(): number {
  const targetInfo = parseArgv(scriptArgs);

  switch (targetInfo.target) {
    case "eval": {
      const { code, lang } = targetInfo;
      evalTarget(code, lang ?? "javascript");
      return 0;
    }
    case "help": {
      const { mistake } = targetInfo;
      helpTarget();
      return mistake ? 2 : 0;
    }
    case "invalid": {
      const { message } = targetInfo;
      invalidTarget(message);
      return 3;
    }
    case "license": {
      licenseTarget();
      return 0;
    }
    case "print-src": {
      printSrcTarget();
      return 0;
    }
    case "print-types": {
      printTypesTarget();
      return 0;
    }
    case "repl": {
      const { lang } = targetInfo;
      replTarget(lang ?? "javascript");
      return 0;
    }
    case "run-file": {
      const { file, lang } = targetInfo;
      runFileTarget(file, lang);
      return 0;
    }
    case "version": {
      versionTarget();
      return 0;
    }
    default: {
      const here: never = targetInfo;
      throw new Error(`Unhandled target: ${JSON.stringify(targetInfo)}`);
    }
  }
}

try {
  const status = main();
  std.exit(status);
} catch (err) {
  printError(err, std.err);
  std.exit(1);
}
