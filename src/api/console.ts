import * as std from "quickjs:std";
import { makeInspectLog } from "./shared/make-inspect-log";

// To overwrite the quickjs console object
export const console = {
  log: makeInspectLog(std.out),
  info: makeInspectLog(std.out),
  warn: makeInspectLog(std.err),
  error: makeInspectLog(std.err),
};

// To overwrite the quickjs globalThis.print
export const print = makeInspectLog(std.out);
