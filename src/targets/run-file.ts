import * as std from "std";

export default function runFileTarget(fileToRun: string) {
  try {
    std.importModule(fileToRun, "./<cwd>");
  } catch (err) {
    try {
      // TODO: need backtraceBarrier for importModule.
      // this is a workaround in the meantime.
      const stackLines = (err as any).stack.split("\n");
      const newLines: Array<string> = [];

      for (const line of stackLines) {
        if (/yavascript-internal\.js/.test(line)) {
          break;
        } else {
          newLines.push(line);
        }
      }

      (err as any).stack = newLines.join("\n");
    } catch (err2) {}

    throw err;
  }
}
