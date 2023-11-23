import stripAnsiFromString from "strip-ansi";
import kleur from "kleur";

kleur.enabled = true;

import { assert } from "../assert";
import { types } from "../types";

import { setHelpText } from "../help";
import stringStylingHelpText from "./string-styling.help.md";
import quoteHelpText from "./quote.help.md";
import stripAnsiHelpText from "./stripAnsi.help.md";

function stripAnsi(input: string | number | Path) {
  if (typeof input === "string") {
    return stripAnsiFromString(input);
  } else {
    return stripAnsiFromString(String(input));
  }
}

setHelpText(stripAnsi, stripAnsiHelpText);

export { stripAnsi };

export const quote = (str: string | number | Path) => {
  assert.type(
    str,
    types.or(types.string, types.number, types.Path),
    "'str' argument must be a string, number, or Path"
  );
  if (typeof str !== "string") {
    str = str.toString();
  }
  return JSON.stringify(str);
};

setHelpText(quote, quoteHelpText);

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

setHelpText(bgBlack, stringStylingHelpText);
setHelpText(bgBlue, stringStylingHelpText);
setHelpText(bgCyan, stringStylingHelpText);
setHelpText(bgGreen, stringStylingHelpText);
setHelpText(bgMagenta, stringStylingHelpText);
setHelpText(bgRed, stringStylingHelpText);
setHelpText(bgWhite, stringStylingHelpText);
setHelpText(bgYellow, stringStylingHelpText);
setHelpText(black, stringStylingHelpText);
setHelpText(blue, stringStylingHelpText);
setHelpText(bold, stringStylingHelpText);
setHelpText(cyan, stringStylingHelpText);
setHelpText(dim, stringStylingHelpText);
setHelpText(gray, stringStylingHelpText);
setHelpText(green, stringStylingHelpText);
setHelpText(grey, stringStylingHelpText);
setHelpText(hidden, stringStylingHelpText);
setHelpText(inverse, stringStylingHelpText);
setHelpText(italic, stringStylingHelpText);
setHelpText(magenta, stringStylingHelpText);
setHelpText(red, stringStylingHelpText);
setHelpText(reset, stringStylingHelpText);
setHelpText(strikethrough, stringStylingHelpText);
setHelpText(underline, stringStylingHelpText);
setHelpText(white, stringStylingHelpText);
setHelpText(yellow, stringStylingHelpText);

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
