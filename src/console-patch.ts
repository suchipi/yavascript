import * as std from "std";
import inspect from "./inspect";

const makeInspectLog =
  (file: std.FILE) =>
  (...args: Array<any>) => {
    for (let i = 0; i < args.length; i++) {
      if (i !== 0) {
        file.puts(" ");
      }
      const arg = args[i];
      if (typeof arg === "string") {
        file.puts(arg);
      } else {
        file.puts(inspect(arg));
      }
    }

    file.puts("\n");
  };

const log = makeInspectLog(std.out);
const warn = makeInspectLog(std.err);

console.log = log;
// @ts-ignore no warn on console
console.warn = warn;
// @ts-ignore no error on console
console.error = console.warn;
