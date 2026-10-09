/**
 * The logger used internally by yavascript API functions such as {@link which},
 * {@link exec}, {@link copy}, {@link glob}, and more.
 *
 * You can modify the properties on this object in order to configure the
 * amount and style of log output from yavascript API functions.
 *
 * This object behaves similarly to the shell builtin `set -x`.
 *
 * **Example**
 * ```ts
 * logger.trace = console.error;
 * logger.info = () => {};
 * exec("echo hi");
 * ```
 */
declare const logger: {
  /**
   * This property is used as the default value for `trace` in yavascript API
   * functions which receive `logging.trace` as an option, like {@link which},
   * {@link exec}, {@link copy} and {@link glob}.
   *
   * The default value of `logger.trace` is a no-op function.
   *
   * **Example**
   * ```ts
   * logger.trace = (...args) => console.error("[trace]", ...args);
   * which("git");
   * ```
   */
  trace: (...args: Array<any>) => void;

  /**
   * This property is used as the default value for `info` in yavascript API
   * functions which receive `logging.info` as an option, like {@link exec},
   * {@link copy}, and {@link glob}.
   *
   * The default value of `logger.info` writes dimmed text to stderr.
   *
   * **Example**
   * ```ts
   * logger.info = () => {};
   * exec("echo hi");
   * ```
   */
  info: (...args: Array<any>) => void;

  /**
   * This property is used as the default value for `warn` in yavascript API
   * functions which receive `logging.warn` as an option, like {@link readEnvBool}.
   *
   * The default value of `logger.warn` writes yellow text to stderr.
   *
   * **Example**
   * ```ts
   * logger.warn = (...args) => console.error("warning:", ...args);
   * readEnvBool("VERBOSE", false);
   * ```
   */
  warn: (...args: Array<any>) => void;
};
