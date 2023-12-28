declare type BaseExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string | Path;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };

  /** Options which control logging. */
  logging?: {
    /**
     * If provided, this logging function will be called multiple times as
     * `exec` runs, to help you understand what's going on and/or troubleshoot
     * things. In most cases, it makes sense to use a function from `console`
     * here, like so:
     *
     * ```js
     * exec(["echo", "hi"], {
     *   logging: { trace: console.log },
     * });
     * ```
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a no-op function.
     */
    trace?: (...args: Array<any>) => void;

    /**
     * An optional, user-provided logging function to be used for informational
     * messages. Less verbose than `logging.trace`.
     *
     * Defaults to the current value of {@link logger.info}. `logger.info`
     * defaults to a function which logs to stderr.
     */
    info?: (...args: Array<any>) => void;
  };

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

  /**
   * If true, exec doesn't return until the process is done running. If false,
   * exec returns an object with a "wait" method which can be used to wait for
   * the process to be done running.
   *
   * Defaults to true.
   */
  block?: boolean;
};

type ExecWaitResult<ExecOptions extends BaseExecOptions> = ExecOptions extends
  | { captureOutput: true | "utf8" | "arraybuffer" }
  | { failOnNonZeroStatus: false }
  ? (ExecOptions["captureOutput"] extends true | "utf8"
      ? { stdout: string; stderr: string }
      : {}) &
      (ExecOptions["captureOutput"] extends "arraybuffer"
        ? { stdout: ArrayBuffer; stderr: ArrayBuffer }
        : {}) &
      (ExecOptions["failOnNonZeroStatus"] extends false
        ?
            | { status: number; signal: undefined }
            | { status: undefined; signal: number }
        : {})
  : void;

declare interface Exec {
  <
    ExecOptions extends BaseExecOptions = {
      failOnNonZeroStatus: true;
      captureOutput: false;
      block: true;
    }
  >(
    args: Array<string | Path | number> | string | Path,
    options?: ExecOptions
  ): ExecOptions["block"] extends false
    ? { wait(): ExecWaitResult<ExecOptions> }
    : ExecWaitResult<ExecOptions>;

  /**
   * Parse the provided value into an array of command-line argument strings,
   * using the same logic that {@link exec} and {@link ChildProcess} use.
   */
  toArgv(args: Array<string | Path | number> | string | Path): Array<string>;
}

/**
 * Runs a child process using the provided arguments.
 *
 * The first value in the arguments array is the program to run.
 */
declare const exec: Exec;

/** Alias for `exec(args, { captureOutput: true })` */
declare function $(args: Array<string | Path | number> | string | Path): {
  stdout: string;
  stderr: string;
};
