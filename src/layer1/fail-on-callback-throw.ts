import * as cmdline from "quickjs:cmdline";

// The engine prints an exception that escapes a timer callback but leaves the
// exit status at 0, so a script whose only failure happens in a callback
// reports success. The exit code is set here and the error rethrown, so the
// engine still prints it the way it always has.
function failProcessOnThrow<Args extends Array<any>>(
  callback: (...args: Args) => void,
): (...args: Args) => void {
  if (typeof callback !== "function") return callback;

  return function (this: any, ...args: Args) {
    try {
      return callback.apply(this, args);
    } catch (err) {
      cmdline.setExitCode(1);
      throw err;
    }
  };
}

export function installCallbackFailureHandling(target: typeof globalThis) {
  for (const name of ["setTimeout", "setInterval"] as const) {
    const original = target[name];
    if (typeof original !== "function") continue;

    const wrapped = function (this: any, callback: any, ...rest: Array<any>) {
      return (original as any).call(
        this,
        failProcessOnThrow(callback),
        ...rest,
      );
    };

    Object.defineProperty(wrapped, "name", {
      value: name,
      configurable: true,
    });
    (target as any)[name] = wrapped;
  }
}

export { failProcessOnThrow };
