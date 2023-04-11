import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { makeErrorWithProperties } from "../error-with-properties";
import { NOTHING } from "../targets/repl/special";

const helpProviders = new Set<(value: unknown) => string | null>();
const helpForValueMap = new Map<any, string>();

export function registerHelpForValue(value: any, text: string) {
  helpForValueMap.set(value, text);
}

export function registerHelpProvider(
  provider: (value: unknown) => string | null
) {
  helpProviders.add(provider);
}

function helpInternal(value?: any): string {
  if (value == null) {
    // Print help for `help` function
    // TODO: make this nicer
    return String.dedent`
      The 'help' function prints help text about its argument.

      Usage: help(anything);

      Example: help(basename);
    `;
  } else {
    let registered = helpForValueMap.get(value);
    if (registered == null) {
      for (const provider of helpProviders) {
        try {
          const result = provider(value);
          if (result != null) {
            registered = result;
            break;
          }
        } catch (err) {
          console.warn(`Warning: help provider errored:`, err);
        }
      }

      if (registered == null) {
        throw makeErrorWithProperties(
          `No help text is available for that value.`,
          { value }
        );
      }
    }

    const output = registered.trimEnd();
    return output;
  }
}

function help(value?: any): typeof NOTHING {
  const output = helpInternal(value);

  // TODO: factor in env.CLICOLOR and env.CLICOLOR_FORCE. See https://bixense.com/clicolors/
  // We should do that in the 'help' target, too.
  if (os.isatty(std.out.fileno())) {
    console.log(output);
  } else {
    const { stripAnsi } = require("./strings");
    console.log(stripAnsi(output));
  }

  return NOTHING;
}

const help_ = Object.assign(help, {
  registerHelpForValue,
  registerHelpProvider,
});

export { help_ as help };
