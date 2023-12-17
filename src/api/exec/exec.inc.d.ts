declare type ExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string | Path;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };

  /**
   * If provided, this function will be called multiple times as `exec`
   * runs, to help you understand what's going on and/or troubleshoot things.
   * In most cases, it makes sense to use a logging function here, like so:
   *
   * ```js
   * exec(["echo", "hi"], { trace: console.log });
   * ```
   */
  trace?: (...args: Array<any>) => void;

  /**
   * Whether an Error should be thrown when the process exits with a nonzero
   * status code.
   *
   * Defaults to true.
   */
  failOnNonZeroStatus?: boolean;

  /**
   * If true, stdout and stderr will be collected into strings or array buffers
   * and returned instead of being printed to the screen.
   *
   * Defaults to false. true is an alias for "utf8".
   */
  captureOutput?: boolean | "utf8" | "arraybuffer";
};

/**
 * Runs a child process using the provided arguments.
 *
 * The first value in the arguments array is the program to run.
 */
declare function exec<Options extends ExecOptions>(
  args: Array<string | Path | number> | string | Path,
  options?: Options
): ExecResult<
  Options extends { captureOutput: infer CaptureOutput }
    ? CaptureOutput extends true
      ? string
      : CaptureOutput extends false
      ? never
      : CaptureOutput extends "arraybuffer"
      ? ArrayBuffer
      : CaptureOutput extends "utf8"
      ? string
      : never
    : never,
  false
>;

/** Alias for `exec(args, { captureOutput: true }).wait()` */
declare function $(
  args: Array<string | Path | number> | string | Path
): ExecResult<string, true>;
