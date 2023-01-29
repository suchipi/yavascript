import { is } from "./is";
import { makeErrorWithProperties } from "../error-with-properties";

function assert(value, message) {
  if (value) return;

  const errMsg = message || "Assertion failed";
  throw makeErrorWithProperties(errMsg, { value });
}

const assertProps = {};

for (const [key, value] of Object.entries(is)) {
  if (typeof value === "function") {
    if (key === "tagged") {
      assertProps[key] = (
        input,
        tag,
        message = `Expected value tagged ${tag}`
      ) => {
        const result = value(input, tag);
        if (result) return;
        throw makeErrorWithProperties(message, { received: input }, TypeError);
      };
    } else {
      assertProps[key] = (input, message = `Expected ${key}`) => {
        const result = value(input);
        if (result) return;
        throw makeErrorWithProperties(message, { received: input }, TypeError);
      };
    }
  }
}

assertProps.JSX = {
  Element: (input, message = "Expected JSX.Element") => {
    const result = is.JSX.Element(input);
    if (result) return;
    throw makeErrorWithProperties(message, { received: input }, TypeError);
  },
  Fragment: (input, message = "Expected JSX.Fragment") => {
    const result = is.JSX.Fragment(input);
    if (result) return;
    throw makeErrorWithProperties(message, { received: input }, TypeError);
  },
};

Object.assign(assert, assertProps);

export { assert };
