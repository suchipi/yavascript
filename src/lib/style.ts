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
