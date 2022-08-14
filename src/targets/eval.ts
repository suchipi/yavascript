import * as std from "std";

export default function evalTarget(codeToRun: string) {
  // TODO: would be better to eval as module
  const result = std.evalScript(codeToRun, { backtraceBarrier: true });
  if (typeof result !== "undefined") {
    console.log(result);
  }
}
