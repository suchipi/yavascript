import { Template } from "./template";
import {
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
} from "../api/strings";

// You can enter '«' and '»' on macOS by hitting "Option+Backslash" and "Option+Shift+Backslash".
const template = new Template("«", "»", {
  // doc sections
  heading: (str: string) => bold(magenta(str)),

  // js/ts syntax highlighting
  comment: (str: string) => dim(str),
  keyword: (str: string) => red(str),
  type: (str: string) => cyan(italic(str)),
  func: (str: string) => green(str),
  param: (str: string) => italic(str),
  string: (str: string) => yellow(str),
  num: (str: string) => magenta(str),
  op: (str: string) => red(str),

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
});

export function style(input: string): string {
  return template.transform(input);
}

global.__style = style;
