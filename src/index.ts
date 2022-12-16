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

import determineTarget from "./determine-target";

function main(): void {
  const targetInfo = determineTarget(scriptArgs);

  switch (targetInfo.target) {
    case "eval": {
      const { code, lang } = targetInfo;
      evalTarget(code, lang ?? "javascript");
      return;
    }
    case "help": {
      helpTarget();
      return;
    }
    case "invalid": {
      const { message } = targetInfo;
      invalidTarget(message);
      std.exit(3);
      return;
    }
    case "license": {
      licenseTarget();
      return;
    }
    case "print-src": {
      printSrcTarget();
      return;
    }
    case "print-types": {
      printTypesTarget();
      return;
    }
    case "repl": {
      const { lang } = targetInfo;
      replTarget(lang ?? "javascript");
      return;
    }
    case "run-file": {
      const { file, lang } = targetInfo;
      runFileTarget(file, lang);
      return;
    }
    case "version": {
      versionTarget();
      return;
    }
    default: {
      const here: never = targetInfo;
      throw new Error(`Unhandled target: ${JSON.stringify(targetInfo)}`);
    }
  }
}

try {
  main();
} catch (err) {
  printError(err, std.err);
  std.exit(1);
}
