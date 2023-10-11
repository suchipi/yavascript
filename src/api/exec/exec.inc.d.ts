declare type BaseExecOptions = {
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

declare interface Exec {
  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: true;
      captureOutput: false;
    }
  ): void;

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: false;
      captureOutput: false;
    }
  ):
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: true;
      captureOutput: true;
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: true;
      captureOutput: "utf8";
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: true;
      captureOutput: "arraybuffer";
    }
  ): { stdout: ArrayBuffer; stderr: ArrayBuffer };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: false;
      captureOutput: true;
    }
  ):
    | { stdout: string; stderr: string; status: number; signal: undefined }
    | { stdout: string; stderr: string; status: undefined; signal: number };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: false;
      captureOutput: "utf-8";
    }
  ):
    | { stdout: string; stderr: string; status: number; signal: undefined }
    | { stdout: string; stderr: string; status: undefined; signal: number };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: false;
      captureOutput: "arraybuffer";
    }
  ):
    | {
        stdout: ArrayBuffer;
        stderr: ArrayBuffer;
        status: number;
        signal: undefined;
      }
    | {
        stdout: ArrayBuffer;
        stderr: ArrayBuffer;
        status: undefined;
        signal: number;
      };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: true;
    }
  ): void;

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      failOnNonZeroStatus: false;
    }
  ):
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      captureOutput: true;
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      captureOutput: "utf8";
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      captureOutput: "arraybuffer";
    }
  ): { stdout: ArrayBuffer; stderr: ArrayBuffer };

  (
    args: Array<string | Path | number> | string | Path,
    options: BaseExecOptions & {
      captureOutput: false;
    }
  ): void;

  (
    args: Array<string | Path | number> | string | Path,
    options?: BaseExecOptions
  ): void;

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
