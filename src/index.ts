import * as std from "std";
import printError from "./print-error";

import installApi from "./api/_installApi";
installApi(globalThis);

import installCoffeeScriptHandlers from "./extension-handlers/coffee";
installCoffeeScriptHandlers();

import helpTarget from "./targets/help";
import versionTarget from "./targets/version";
import licenseTarget from "./targets/license";
import runFileTarget from "./targets/run-file";
import evalTarget from "./targets/eval";
import replTarget from "./targets/repl";

function main() {
  const argsObject: { [key: string]: any } = {};
  const positionalArgs: Array<string> = [];

  // i starts at 1 to skip scriptArgs[0] which will always be the yavascript binary
  for (let i = 1; i < scriptArgs.length; i++) {
    const arg = scriptArgs[i];
    const nextArg = scriptArgs[i + 1] || null;

    if (arg === "-h" || arg === "--help") {
      argsObject.help = true;
    } else if (arg === "-v" || arg === "--version" || arg === "-version") {
      argsObject.version = true;
    } else if (arg === "--license") {
      argsObject.license = true;
    } else if (arg === "-e" || arg === "--eval") {
      argsObject.eval = nextArg;
      i++;
    } else if (arg === "--lang") {
      argsObject.lang = nextArg;
      i++;
    } else {
      positionalArgs.push(arg);
    }
  }

  if (argsObject.help) {
    helpTarget();
  } else if (typeof argsObject.eval !== "undefined") {
    let inputCode: string | null = argsObject.eval;
    let lang = argsObject.lang ?? "javascript";

    if (inputCode == null) {
      std.err.puts(
        `Please specify the code string to run. For example: ${scriptArgs[0]} -e 'echo("hi")'\nFor more info, run ${scriptArgs[0]} --help.`
      );
      std.exit(1);
    } else {
      evalTarget(inputCode, lang);
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
    const fileToRun = positionalArgs[0];

    if (fileToRun == null) {
      let lang = argsObject.lang ?? "javascript";
      replTarget(lang);
    } else {
      if (argsObject.lang) {
        std.err.puts(
          `WARNING: '--lang' has no impact when running files, as their language will be determined by their filetype extension. To silence this warning, do not pass '--lang'.\n`
        );
      }
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
