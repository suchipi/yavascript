import * as std from "quickjs:std";
import { assert } from "../../assert";
import { setHelpText } from "../../help";
import printHelpText from "./printf.help.md";

export function printf(format: string, ...args: Array<any>): void {
  assert.type(format, String, "'format' argument must be a string");

  std.out.printf(format, ...args);
}

setHelpText(printf, printHelpText);
