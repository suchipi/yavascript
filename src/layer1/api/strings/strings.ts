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

// kleur returns a chainable object when called with no argument, but these are
// declared as returning a string.
const wrapColor =
  (colorize: (text: string) => string) =>
  (input: string | number | Path): string => {
    assert.type(
      input,
      types.or(types.string, types.number, types.Path),
      "argument must be a string, number, or Path",
    );
    return colorize(String(input));
  };

const bgBlack_ = wrapColor(bgBlack);
const bgBlue_ = wrapColor(bgBlue);
const bgCyan_ = wrapColor(bgCyan);
const bgGreen_ = wrapColor(bgGreen);
const bgMagenta_ = wrapColor(bgMagenta);
const bgRed_ = wrapColor(bgRed);
const bgWhite_ = wrapColor(bgWhite);
const bgYellow_ = wrapColor(bgYellow);
const black_ = wrapColor(black);
const blue_ = wrapColor(blue);
const bold_ = wrapColor(bold);
const cyan_ = wrapColor(cyan);
const dim_ = wrapColor(dim);
const gray_ = wrapColor(gray);
const green_ = wrapColor(green);
const grey_ = wrapColor(grey);
const hidden_ = wrapColor(hidden);
const inverse_ = wrapColor(inverse);
const italic_ = wrapColor(italic);
const magenta_ = wrapColor(magenta);
const red_ = wrapColor(red);
const reset_ = wrapColor(reset);
const strikethrough_ = wrapColor(strikethrough);
const underline_ = wrapColor(underline);
const white_ = wrapColor(white);
const yellow_ = wrapColor(yellow);

export {
  bgBlack_ as bgBlack,
  bgBlue_ as bgBlue,
  bgCyan_ as bgCyan,
  bgGreen_ as bgGreen,
  bgMagenta_ as bgMagenta,
  bgRed_ as bgRed,
  bgWhite_ as bgWhite,
  bgYellow_ as bgYellow,
  black_ as black,
  blue_ as blue,
  bold_ as bold,
  cyan_ as cyan,
  dim_ as dim,
  gray_ as gray,
  green_ as green,
  grey_ as grey,
  hidden_ as hidden,
  inverse_ as inverse,
  italic_ as italic,
  magenta_ as magenta,
  red_ as red,
  reset_ as reset,
  strikethrough_ as strikethrough,
  underline_ as underline,
  white_ as white,
  yellow_ as yellow,
};
