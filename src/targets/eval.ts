import std from "std";
import os from "os";

export default function evalTarget(codeToRun: string) {
  // Make os and std available as globals
  Object.assign(globalThis, { os, std });

  // TODO: would be better to eval as module
  const result = std.evalScript(codeToRun, { backtraceBarrier: true });
  if (typeof result !== "undefined") {
    console.log(result);
  }
}
