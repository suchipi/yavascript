import stripAnsi from "strip-ansi";
import kleur from "kleur";

kleur.enabled = true;

import { assert } from "../assert";
import { types } from "../types";

export { stripAnsi };

export const quote = (str: string | Path) => {
  assert.type(
    str,
    types.or(types.string, types.Path),
    "'str' argument must be a string or Path"
  );
  if (typeof str !== "string") {
    str = str.toString();
  }
  return JSON.stringify(str);
};

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
