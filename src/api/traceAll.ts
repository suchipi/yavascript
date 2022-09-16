let defaultTrace: undefined | ((...args: Array<any>) => void) = undefined;

export default Object.assign(
  function traceAll(trace: typeof defaultTrace | boolean) {
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
