import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { makeErrorWithProperties } from "../error-with-properties";
import { NOTHING } from "../targets/repl/special";

const registeredHelp = new Map<any, string>();

// TODO create a user-facing "help provider" registry thing so third-party stuff can be documented.
export function registerHelp(key: any, text: string) {
  registeredHelp.set(key, text);
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
      let output = registered.trimEnd();

      // TODO: factor in env.CLICOLOR and env.CLICOLOR_FORCE. See https://bixense.com/clicolors/
      // We should do that in the 'help' target, too.
      if (os.isatty(std.out.fileno())) {
        console.log(output);
      } else {
        const { stripAnsi } = require("./strings");
        console.log(stripAnsi(output));
      }
    }
  }

  return NOTHING;
}
