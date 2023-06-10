import { assert } from "../assert";
import { types } from "../types";

let defaultTrace: undefined | ((...args: Array<any>) => void) = undefined;

const traceType = types.or(types.anyFunction, types.boolean);

const traceAll = Object.assign(
  function traceAll(trace: typeof defaultTrace | boolean) {
    assert.type(
      trace,
      traceType,
      "'trace' argument must be either a boolean or a function"
    );

    if (typeof trace === "boolean") {
      if (trace) {
        defaultTrace = console.error;
      } else {
        defaultTrace = undefined;
      }
    } else {
      defaultTrace = trace;
    }
  },
  {
    getDefaultTrace() {
      return defaultTrace;
    },
  }
);

export { traceAll };
