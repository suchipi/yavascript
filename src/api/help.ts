import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { makeErrorWithProperties } from "../error-with-properties";
import { style } from "./style";
import { NOTHING } from "../targets/repl/special";

const registeredHelp = new Map<any, { text: string; skipStyle: boolean }>();

// TODO create a user-facing "help provider" registry thing so third-party stuff can be documented.
export function registerHelp(
  key: any,
  text: string,
  skipStyle: boolean = false
) {
  registeredHelp.set(key, { text, skipStyle });
}

export function help(key?: any): typeof NOTHING {
  if (key == null) {
    const helpTarget = require("../targets/help").default;
    helpTarget();
    return NOTHING;
  } else {
    const registered = registeredHelp.get(key);
    if (registered == null) {
      throw makeErrorWithProperties(
        `No help entry has been registered for that value.`,
        { value: key }
      );
    } else {
      let formatted: string;
      if (registered.skipStyle) {
        formatted = registered.text;
      } else {
        formatted = style(registered.text);
      }

      formatted = "\n" + formatted + "\n";

      if (os.isatty(std.out.fileno())) {
        console.log(formatted);
      } else {
        const { stripAnsi } = require("./strings");
        console.log(stripAnsi(formatted));
      }
    }
  }

  return NOTHING;
}
