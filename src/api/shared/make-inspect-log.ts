import * as std from "std";
import * as inspectOptions from "../../inspect-options";

export const makeInspectLog =
  (file: FILE) =>
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
          str = inspect(arg, inspectOptions.forPrint);
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
