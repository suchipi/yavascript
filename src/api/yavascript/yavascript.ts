import { version, arch } from "../../hardcoded";
import compilers from "../../compilers";
import { setHelpText } from "../help";
import yavascriptHelpText from "./yavascript.help.md";

export const yavascript = {
  version,
  arch,
  ecmaVersion: "ES2020",
  compilers,
};

setHelpText(yavascript, yavascriptHelpText);
