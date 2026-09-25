import stripAnsiFromString from "strip-ansi";
import kleur from "kleur";
import type { Path } from "../path";

kleur.enabled = true;

import { assert } from "../assert";
import { types } from "../types";

function stripAnsi(input: string | number | Path) {
  if (typeof input === "string") {
    return stripAnsiFromString(input);
  } else {
    return stripAnsiFromString(String(input));
  }
}

export { stripAnsi };

export const quote = (str: string | number | Path) => {
  assert.type(
    str,
    types.or(types.string, types.number, types.Path),
    "'str' argument must be a string, number, or Path",
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
