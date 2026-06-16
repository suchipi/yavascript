/**
 * For compatibility with Node.js scripts, the global object is accessible via
 * the global variable named "global".
 */
declare var global: typeof globalThis;

/**
 * A `process` global is provided for rudimentary compatibility with Node.js
 * scripts. It contains a subset of the properties found on the Node.js
 * `process` global, which each forward to their corresponding yavascript API.
 *
 * For instance, `process.env` is a getter that returns {@link env}, and
 * `process.argv` is a getter that returns {@link scriptArgs}.
 *
 * If you are writing yavascript-specific code, you should use yavascript's APIs
 * instead of `process`.
 */
declare var process: {
  version: string;
  versions: {
    node: string;
    yavascript: string;
    unicode: string;
  };
  arch: string;
  /** Same as the global {@link env}. */
  readonly env: { [key: string]: string | undefined };
  /** Same as the global {@link scriptArgs}. */
  readonly argv: Array<string>;
  /** Same as `scriptArgs[0]`. */
  readonly argv0: string;
  /**
   * Shortcut for `os.realpath(os.execPath())`, using the QuickJS {@link os}
   * module.
   */
  readonly execPath: string;
  /**
   * Uses `std.getExitCode()` and `std.setExitCode()` from the QuickJS
   * {@link std} module.
   */
  exitCode: number;
  /**
   * Uses `std.exit()` from the QuickJS {@link std} module.
   */
  exit(code?: number | null | undefined): void;
};
