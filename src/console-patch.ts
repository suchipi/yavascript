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

      let str: string;
      try {
        str = inspect(arg);
      } catch (err) {
        str = String(arg);
      }
      file.puts(str);
    }

    file.puts("\n");
  };

const log = makeInspectLog(std.out);
const warn = makeInspectLog(std.err);

console.log = log;
// @ts-ignore no info on console
console.info = log;
// @ts-ignore no warn on console
console.warn = warn;
// @ts-ignore no error on console
console.error = warn;
