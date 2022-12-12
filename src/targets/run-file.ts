import * as std from "std";

export default function runFileTarget(fileToRun: string) {
  std.importModule(fileToRun, "./<cwd>");
}
