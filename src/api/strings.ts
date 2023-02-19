import * as std from "quickjs:std";
import stripAnsi from "strip-ansi";
import kleur from "kleur";

kleur.enabled = true;

import { NOTHING } from "../targets/repl/special";
import { assert } from "./assert";
import { types } from "./types";

export { stripAnsi };

export const quote = (str: string) => {
  assert.type(str, types.string, "'str' argument must be a string");
  return JSON.stringify(str);
};

export function clear() {
  std.out.puts("\u001b[2J\u001b[0;0H"); // Clear screen
  std.out.puts("\u001b[3J"); // Clear scrollback
  return NOTHING;
}

const {
  bgBlack,
  bgBlue,
  bgCyan,
  bgGreen,
  bgMagenta,
  bgRed,
  bgWhite,
  bgYellow,
  black,
  blue,
  bold,
  cyan,
  dim,
  gray,
  green,
  grey,
  hidden,
  inverse,
  italic,
  magenta,
  red,
  reset,
  strikethrough,
  underline,
  white,
  yellow,
} = kleur;

export {
  bgBlack,
  bgBlue,
  bgCyan,
  bgGreen,
  bgMagenta,
  bgRed,
  bgWhite,
  bgYellow,
  black,
  blue,
  bold,
  cyan,
  dim,
  gray,
  green,
  grey,
  hidden,
  inverse,
  italic,
  magenta,
  red,
  reset,
  strikethrough,
  underline,
  white,
  yellow,
};
