import * as std from "std";
import kleur from "kleur";
import { NOTHING } from "../targets/repl/special";

kleur.enabled = true;

import stripAnsi from "strip-ansi";

export { stripAnsi };

export const quote = (str: string) => JSON.stringify(str);

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
