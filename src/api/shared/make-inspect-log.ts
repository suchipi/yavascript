import * as std from "quickjs:std";
import * as inspectOptions from "../../inspect-options";

export function inspectManyToParts(args: Array<any>): Array<string> {
  const out: Array<string> = [];

  for (let i = 0; i < args.length; i++) {
    if (i !== 0) {
      out.push(" ");
    }
    const arg = args[i];

    let str: string;
    if (typeof arg === "string") {
      str = arg;
    } else {
      try {
        str = inspect(arg, inspectOptions.forPrint());
      } catch (err) {
        try {
          std.err.puts((err as any).message + "\n");
        } catch (err) {
          // I give up
        }
        str = String(arg);
      }
    }

    out.push(str);
  }

  return out;
}

export function inspectManyToFile(args: Array<any>, file: FILE): void {
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
        str = inspect(arg, inspectOptions.forPrint());
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
}

export const makeInspectLog =
  (file: FILE) =>
  (...args: Array<any>) => {
    inspectManyToFile(args, file);
    file.puts("\n");
  };
