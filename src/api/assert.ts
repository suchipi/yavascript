import { is } from "./is";
import { makeErrorWithProperties } from "../error-with-properties";

function assert(value: any, message?: string) {
  if (value) return;

  const errMsg = message || "Assertion failed";
  throw makeErrorWithProperties(errMsg, { value });
}

const assertProps: { [key: string]: any } = {};

for (const entry of Object.entries(is)) {
  const [key, value]: [string, any] = entry;

  if (typeof value === "function") {
    if (key === "tagged") {
      assertProps[key] = (
        input: any,
        tag: string,
        message: string = `Expected value tagged ${tag}`
      ) => {
        const result = value(input, tag);
        if (result) return;
        throw makeErrorWithProperties(message, { actual: input });
      };
    } else {
      assertProps[key] = (input: any, message: string = `Expected ${key}`) => {
        const result = value(input);
        if (result) return;
        throw makeErrorWithProperties(message, { actual: input });
      };
    }
  }
}

assertProps.JSX = {
  Element: (input: any, message: string = "Expected JSX.Element") => {
    const result = is.JSX.Element(input);
    if (result) return;
    throw makeErrorWithProperties(message, { actual: input });
  },
  Fragment: (input: any, message: string = "Expected JSX.Fragment") => {
    const result = is.JSX.Fragment(input);
    if (result) return;
    throw makeErrorWithProperties(message, { actual: input });
  },
};

Object.assign(assert, assertProps);

export { assert };
