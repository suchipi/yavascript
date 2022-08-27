import * as std from "std";
import inspectOptionsForPrint from "../inspect-options-for-print";

const makeInspectLog =
  (file: std.FILE) =>
  (...args: Array<any>) => {
    for (let i = 0; i < args.length; i++) {
      if (i !== 0) {
        file.puts(" ");
      }
      const arg = args[i];

      let str: string;
      if (typeof arg === "string") {
        str = arg;
      } else {
        try {
          str = inspect(arg, inspectOptionsForPrint);
        } catch (err) {
          try {
            std.err.puts((err as any).message + "\n");
          } catch (err) {
            // I give up
          }
          str = String(arg);
        }
      }

      file.puts(str);
    }

    file.puts("\n");
  };

// To overwrite the quickjs console object
export const console = {
  log: makeInspectLog(std.out),
  info: makeInspectLog(std.out),
  warn: makeInspectLog(std.err),
  error: makeInspectLog(std.err),
};

export const echo = makeInspectLog(std.out);

// To overwrite the quickjs globalThis.print
export const print = makeInspectLog(std.out);
