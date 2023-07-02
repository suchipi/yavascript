import * as std from "quickjs:std";
import { makeInspectLog } from "../shared/make-inspect-log";
import { NOTHING } from "../repl/special";
import { setHelpText } from "../help";
import consoleHelpText from "./console.help.md";
import consoleLogHelpText from "./console.log.help.md";
import consoleInfoHelpText from "./console.info.help.md";
import consoleWarnHelpText from "./console.warn.help.md";
import consoleErrorHelpText from "./console.error.help.md";
import consoleClearHelpText from "./console.clear.help.md";
import printHelpText from "./print.help.md";

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

setHelpText(console, consoleHelpText);
setHelpText(console.log, consoleLogHelpText);
setHelpText(console.info, consoleInfoHelpText);
setHelpText(console.warn, consoleWarnHelpText);
setHelpText(console.error, consoleErrorHelpText);
setHelpText(console.clear, consoleClearHelpText);

// To overwrite the quickjs globalThis.print
export const print = makeInspectLog(std.out);

setHelpText(print, printHelpText);
