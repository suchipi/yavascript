import * as std from "quickjs:std";
import { assert } from "../../assert";

export function printf(format: string, ...args: Array<any>): void {
  assert.type(format, String, "'format' argument must be a string");

  std.out.printf(format, ...args);
}
