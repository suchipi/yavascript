import { makeErrorWithProperties } from "../../error-with-properties";
import { NOTHING } from "../repl/special";
import { hasColors } from "../../has-colors";
import helpHelpText from "./help.help.md";
import getHelpTextHelpText from "./help.getHelpText.help.md";
import setHelpTextHelpText from "./help.setHelpText.help.md";
import setHelpTextLazyHelpText from "./help.setHelpText.lazy.help.md";
import helpIndexHelpText from "./help.index.help.md";

const helpTextMap = new WeakMap<any, string>();
const primitiveHelpTextMap = new Map<any, string>();
const lazyHelpTextMap = new WeakMap<any, () => string>();
const primitiveLazyHelpTextMap = new Map<any, () => string>();

export function setHelpText(
  value: any,
  text: string,
  allowNullish: boolean = false
) {
  if (value == null && !allowNullish) {
    throw new Error(
      "Attempting to set help text for the value 'null' or 'undefined'. This is usually a mistake. If you truly wish to do this, pass `true` as the third argument to setHelpText."
    );
  }

  if (typeof text !== "string" && !((text as any) instanceof String)) {
    throw makeErrorWithProperties(
      "'text' argument must be a string",
      { actual: text },
      TypeError
    );
  }

  if (Object.isPrimitive(value)) {
    if (primitiveHelpTextMap.has(value)) {
      throw makeErrorWithProperties(
        "Attempting to overwrite existing help text",
        { info: "primitive set", value }
      );
    }
    primitiveHelpTextMap.set(value, text);
  } else {
    if (helpTextMap.has(value)) {
      throw makeErrorWithProperties(
        "Attempting to overwrite existing help text",
        { info: "set", value }
      );
    }
    helpTextMap.set(value, text);
  }
}

function setLazyHelpText(value: any, getText: () => string) {
  if (typeof getText !== "function") {
    throw makeErrorWithProperties(
      "'getText' argument must be a function",
      { actual: getText },
      TypeError
    );
  }

  if (Object.isPrimitive(value)) {
    if (primitiveHelpTextMap.has(value)) {
      throw makeErrorWithProperties(
        "Attempting to overwrite existing help text",
        { target: "primitive setLazy", value }
      );
    }
    if (primitiveLazyHelpTextMap.has(value)) {
      throw makeErrorWithProperties(
        "Attempting to overwrite existing help text",
        { target: "primitiveLazy setLazy", value }
      );
    }
    primitiveLazyHelpTextMap.set(value, getText);
  } else {
    if (helpTextMap.has(value)) {
      throw makeErrorWithProperties(
        "Attempting to overwrite existing help text",
        { target: "setLazy", value }
      );
    }
    if (lazyHelpTextMap.has(value)) {
      throw makeErrorWithProperties(
        "Attempting to overwrite existing help text",
        { target: "lazy setLazy", value }
      );
    }
    lazyHelpTextMap.set(value, getText);
  }
}

setHelpText.lazy = setLazyHelpText;

export function getHelpText(value: any): string | null {
  const { textMap, lazyTextMap } = Object.isPrimitive(value)
    ? { textMap: primitiveHelpTextMap, lazyTextMap: primitiveLazyHelpTextMap }
    : { textMap: helpTextMap, lazyTextMap: lazyHelpTextMap };

  const textResult = textMap.get(value);
  if (textResult != null) {
    return textResult;
  }

  const lazyResult = lazyTextMap.get(value);
  if (lazyResult != null) {
    const text = lazyResult();
    setHelpText(value, text);
    lazyHelpTextMap.delete(value);
    return text;
  }

  return null;
}

function helpInternal(value?: any): string {
  if (arguments.length === 0) {
    return helpIndexHelpText.trimEnd();
  } else {
    const registered = getHelpText(value);

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
  const output = helpInternal.apply(null, arguments as any);

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
  getHelpText,
});

setHelpText(help_, helpHelpText);
setHelpText(setHelpText, setHelpTextHelpText);
setHelpText(getHelpText, getHelpTextHelpText);
setHelpText(setLazyHelpText, setHelpTextLazyHelpText);

export { help_ as help };

// internal only
export function wrappedString(str: string, helpText: string): string {
  const ret = new String(str) as any;
  ret[Symbol.typeofValue] = () => "string";
  setHelpText(ret, helpText);
  return ret;
}

// internal only
export function wrappedStringLazy(
  str: string,
  getHelpText: () => string
): string {
  const ret = new String(str) as any;
  ret[Symbol.typeofValue] = () => "string";
  setLazyHelpText(ret, getHelpText);
  return ret;
}
