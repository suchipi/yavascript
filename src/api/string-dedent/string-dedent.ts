import dedent from "string-dedent";
import { setHelpText } from "../help";
import stringDedentHelpText from "./string-dedent.help.md";

setHelpText(dedent, stringDedentHelpText);

export function install(stringConstructor: StringConstructor) {
  // @ts-ignore
  stringConstructor.dedent = dedent;
}
