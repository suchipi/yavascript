import * as std from "std";

export function printf(format: string, ...args: Array<any>): void {
  std.out.printf(format, ...args);
}
