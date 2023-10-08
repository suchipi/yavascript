/**
 * Configures the default value of `trace` in yavascript API functions which
 * receive `trace` as an option, like {@link which}, {@link exec}, {@link copy}
 * and {@link glob}.
 *
 * - If called with `true`, the default value of `trace` in all functions which
 *   receive a `trace` option will be changed to `console.error`.
 * - If called with `false`, the default value of `trace` in all functions which
 *   receive a `trace` option will be changed to `undefined`.
 * - If called with any other value, the provided value will be used as the
 *   default value of `trace` in all functions which receive a `trace` option.
 *
 * If you would like to make your own functions use the default value of `trace`
 * as set by this function (in order to get the same behavior as yavascript API
 * functions which do so), call `traceAll.getDefaultTrace()` to get the current
 * value which should be used as the default value.
 *
 * `traceAll` provides similar functionality to shell builtin `set -x`.
 */
declare const traceAll: ((
  trace: boolean | undefined | ((...args: Array<any>) => void)
) => void) & {
  getDefaultTrace(): ((...args: Array<any>) => void) | undefined;
};
