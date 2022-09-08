import std from "std";
import os from "os";
import * as esmToRequire from "../esm-to-require";
import { NOTHING } from "./repl/special";

export default function evalTarget(codeToRun: string) {
  // Make os and std available as globals
  Object.assign(globalThis, { os, std });

  const transformedCode = esmToRequire.transform(codeToRun);
  const result = std.evalScript(transformedCode, { backtraceBarrier: true });
  if (typeof result !== "undefined" && result !== NOTHING) {
    console.log(result);
  }
}
