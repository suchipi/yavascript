export function printGlobals(theGlobal: typeof globalThis) {
  console.log(); // print newline first so inline snapshot is more readable

  const PLACEHOLDER = Symbol("PLACEHOLDER");

  const globalDescriptors = Object.getOwnPropertyDescriptors(theGlobal);
  for (const [key, descriptor] of Object.entries(globalDescriptors)) {
    let logLine = key + ":";

    let value;
    try {
      value = theGlobal[key];
      if (
        typeof value === "object" &&
        value !== null &&
        Object.isFrozen(value)
      ) {
        logLine += " frozen";
      }
      logLine += " " + typeof value;
    } catch (err) {
      logLine += " get throws error";
    }

    if (
      (descriptor.writable || descriptor.set) &&
      key !== "undefined" &&
      key !== "globalThis"
    ) {
      try {
        theGlobal[key] = PLACEHOLDER;
        if (theGlobal[key] !== PLACEHOLDER) {
          logLine += " writable but rejects new value";
        }
      } catch (err) {
        logLine += " set throws error";
      }
      try {
        theGlobal[key] = value;
      } catch (err) {
        /* ignored */
      }
    } else {
      logLine += " readonly";
    }

    logLine += " (";
    if (descriptor.get) {
      logLine += "G";
    }
    if (descriptor.set) {
      logLine += "S";
    }
    if (descriptor.configurable) {
      logLine += "C";
    }
    if (descriptor.writable) {
      logLine += "W";
    }
    if (descriptor.enumerable) {
      logLine += "E";
    }
    logLine += ")";

    console.log(logLine);
  }
}
