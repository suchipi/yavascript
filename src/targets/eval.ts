import std from "std";
import os from "os";
import * as esmToRequire from "../esm-to-require";
import { NOTHING } from "./repl/special";
import compilers from "../compilers";

export default function evalTarget(inputCode: string, lang: string) {
  // Make os and std available as globals
  Object.assign(globalThis, { os, std });

  let codeToRun: string | null = null;
  switch (lang) {
    case "javascript": {
      codeToRun = inputCode;
      break;
    }
    case "coffeescript": {
      codeToRun = compilers.coffee(inputCode, { expression: true });
      break;
    }
    default: {
      throw new Error(`Unhandled lang: ${lang}`);
    }
  }

  const transformedCode = esmToRequire.transform(codeToRun);
  const result = std.evalScript(transformedCode, { backtraceBarrier: true });
  if (typeof result !== "undefined" && result !== NOTHING) {
    console.log(result);
  }
}
