import highlight from "@suchipi/babel-highlight";
import { black, blue, dim, red, underline } from "../api/strings";

export function _highlight(code: string): string {
  return highlight(code, {
    capitalized: blue,
    comment: dim,
    invalid: (str) => bgRed(black(underline(str))),
    jsxIdentifier: blue,
    keyword: red,
    punctuator: red,
    number: magenta,
    regex: yellow,
    string: yellow,
  });
}
