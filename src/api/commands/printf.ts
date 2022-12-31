import * as std from "quickjs:std";

export function printf(format: string, ...args: Array<any>): void {
  std.out.printf(format, ...args);
}
