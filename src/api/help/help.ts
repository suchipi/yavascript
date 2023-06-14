import { makeErrorWithProperties } from "../../error-with-properties";
import { NOTHING } from "../../targets/repl/special";
import { hasColors } from "../../has-colors";
import helpHelpText from "./help.help.md";

const helpTextMap = new WeakMap<any, string>();

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
      `Cannot register help text for the value '${value}'. Help text is stored using a WeakMap, and '${value}' cannot be used as a WeakMap key, because its type is what's known as a 'primitive' type. Strings, numbers, and other values which are passed-by-value instead of passed-by-reference are all 'primitive' types.`,
      { value },
      TypeError
    );
  }

  helpTextMap.set(value, text);
}

function helpInternal(value?: any): string {
  if (value == null) {
    return helpHelpText;
  } else {
    const registered = helpTextMap.get(value);

    if (registered == null) {
      // not using makeErrorWithProperties here as `value` will often be a
      // function, and makeErrorWithProperties stringifies the function, which
      // results in a really long and noisy error message.
      //
      // the `value` property we set on `err` will still get printed.
      const err: any = new Error(`No help text is available for that value.`);
      err.value = value;
      throw err;
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
    const { stripAnsi } = require("../strings");
    console.log(stripAnsi(output));
  }

  return NOTHING;
}

const help_ = Object.assign(help, {
  setHelpText,
});

setHelpText(help_, helpHelpText);
setHelpText(setHelpText, helpHelpText);

export { help_ as help };
