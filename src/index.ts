import * as std from "std";
import "./console-patch";
import "./api";
import * as pkg from "../package.json";
import readme from "../README.md";

let target;
if (scriptArgs.includes("-h") || scriptArgs.includes("--help")) {
  target = "help";
} else if (scriptArgs.includes("-e") || scriptArgs.includes("--eval")) {
  target = "eval";
} else if (scriptArgs.includes("-v") || scriptArgs.includes("--version") || scriptArgs.includes("-version")) {
  target = "version";
} else {
  target = "runFile";
}

switch (target) {
  case "runFile": {
    const fileToRun = scriptArgs[1];

    if (fileToRun == null) {
      std.err.puts(
        `Please specify a file to run. For example: ${scriptArgs[0]} ./my-script.js\nFor more info, run ${scriptArgs[0]} --help.`
      );
      std.exit(1);
    }

    std.importModule(fileToRun, "./<cwd>");

    break;
  }
  case "eval": {
    let codeToRun;
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
    }

    // TODO: would be better to eval as module
    std.evalScript(codeToRun, { backtraceBarrier: true });

    break;
  }
  case "version": {
    std.out.puts(pkg.version);
    break;
  }
  case "help": {
    std.err.puts(`yavascript ${pkg.version}

Usage: One of these:
  yavascript <path/to/file-to-run.js>
  yavascript -e '<code-to-run>'
  yavascript --eval '<code-to-run>'
  yavascript -v
  yavascript --version

${readme.split("\n").slice(4).join("\n")}`);
    std.exit(2);
    break;
  }
}
