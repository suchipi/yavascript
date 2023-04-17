import * as std from "quickjs:std";
import { makeInspectLog } from "./shared/make-inspect-log";
import { NOTHING } from "../targets/repl/special";

export function clear() {
  std.out.puts("\u001b[2J\u001b[0;0H"); // Clear screen
  std.out.puts("\u001b[3J"); // Clear scrollback
  return NOTHING;
}

// To overwrite the quickjs console object
export const console = {
  log: makeInspectLog(std.out),
  info: makeInspectLog(std.out),
  warn: makeInspectLog(std.err),
  error: makeInspectLog(std.err),
  clear,
};

// To overwrite the quickjs globalThis.print
export const print = makeInspectLog(std.out);
