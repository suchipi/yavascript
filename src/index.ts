import * as std from "std";
import printError from "./print-error";

import "./primordials";

import determineTarget from "./determine-target";

function main(): void {
  const targetInfo = determineTarget(scriptArgs);

  switch (targetInfo.target) {
    case "eval": {
      const evalTarget: typeof import("./targets/eval").default =
        require("./targets/eval").default;

      const { code, lang } = targetInfo;
      evalTarget(code, lang ?? "javascript");
      return;
    }
    case "help": {
      const helpTarget: typeof import("./targets/help").default =
        require("./targets/help").default;

      helpTarget();
      return;
    }
    case "invalid": {
      const invalidTarget: typeof import("./targets/invalid").default =
        require("./targets/invalid").default;

      const { message } = targetInfo;
      invalidTarget(message);
      std.exit(3);
      return;
    }
    case "license": {
      const licenseTarget: typeof import("./targets/license").default =
        require("./targets/license").default;

      licenseTarget();
      return;
    }
    case "print-types": {
      const printTypesTarget: typeof import("./targets/print-types").default =
        require("./targets/print-types").default;

      printTypesTarget();
      return;
    }
    case "repl": {
      const replTarget: typeof import("./targets/repl").default =
        require("./targets/repl").default;

      const { lang } = targetInfo;
      replTarget(lang ?? "javascript");
      return;
    }
    case "run-file": {
      const runFileTarget: typeof import("./targets/run-file").default =
        require("./targets/run-file").default;

      const { file, lang } = targetInfo;
      runFileTarget(file, lang);
      return;
    }
    case "version": {
      const versionTarget: typeof import("./targets/version").default =
        require("./targets/version").default;

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
