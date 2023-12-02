import iarnaTOML from "@iarna/toml";
import { setHelpText } from "../help";
import tomlHelpText from "./toml.help.md";
import tomlParseHelpText from "./toml.parse.help.md";
import tomlStringifyHelpText from "./toml.stringify.help.md";

export const TOML = {
  parse(data: string): { [key: string]: any } {
    return iarnaTOML.parse(data);
  },
  stringify(data: { [key: string]: any }): string {
    return iarnaTOML.stringify(data);
  },
};

setHelpText(TOML, tomlHelpText);
setHelpText(TOML.parse, tomlParseHelpText);
setHelpText(TOML.stringify, tomlStringifyHelpText);
