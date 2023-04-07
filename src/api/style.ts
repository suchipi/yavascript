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
} from "./strings";

const defaultFunctions = {
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

const FORMATTED_SECTION_REGEX = /((?:\w|\.)+)「([^」]*?)」/g;

export function style(
  input: string,
  functions: { [key: string]: (str: string) => string } = defaultFunctions
): string {
  return input.replace(
    FORMATTED_SECTION_REGEX,
    (match: string, fnNames: string, content: string) => {
      let value = content;
      for (const fnName of fnNames.split(".")) {
        if (Object.hasOwn(functions, fnName)) {
          value = functions[fnName](value);
        } else {
          return match;
        }
      }

      return value;
    }
  );
}
