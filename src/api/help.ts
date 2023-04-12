import { makeErrorWithProperties } from "../error-with-properties";
import { NOTHING } from "../targets/repl/special";
import { hasColors } from "../has-colors";
import helpHelpText from "./help.help.md";

const HELP_TEXT = Symbol("HELP_TEXT");

export function setHelpText(value: any, text: string) {
  if (typeof text !== "string" && !((text as any) instanceof String)) {
    throw makeErrorWithProperties(
      "'text' argument must be a string",
      { actual: text },
      TypeError
    );
  }

  if (Object.isPrimitive(value)) {
    throw makeErrorWithProperties(
      `Cannot register help text for the value '${value}'. Help text is stored as a property on the value, and '${value}' cannot have properties written onto it.`,
      { value },
      TypeError
    );
  }

  value[HELP_TEXT] = text;
  if (value[HELP_TEXT] !== text) {
    throw makeErrorWithProperties(
      `Failed to register help text; after writing to a symbol property, reading that property didn't result in the same value that was written. If you are using a proxy, getter, or setter, ensure it handles unknown symbol properties correctly. Primitive values cannot have help text set on them.`,
      { value },
      TypeError
    );
  }
}

function helpInternal(value?: any): string {
  if (value == null) {
    return helpHelpText;
  } else {
    const registered = value[HELP_TEXT];

    if (registered == null) {
      throw makeErrorWithProperties(
        `No help text is available for that value.`,
        { value }
      );
    }

    const output = registered.trimEnd();
    return output;
  }
}

function help(value?: any): typeof NOTHING {
  const output = helpInternal(value);

  if (hasColors()) {
    console.log(output);
  } else {
    const { stripAnsi } = require("./strings");
    console.log(stripAnsi(output));
  }

  return NOTHING;
}

const help_ = Object.assign(help, {
  setHelpText,
});

export { help_ as help };
