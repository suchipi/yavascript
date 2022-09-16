declare type BaseExecOptions = {
  /** Sets the current working directory for the child process. */
  cwd?: string;

  /** Sets environment variables within the process. */
  env?: { [key: string | number]: string | number | boolean };
};

declare interface Exec {
  (args: Array<string> | string): void;

  (args: Array<string> | string, options: Record<string, never>): void;

  (
    args: Array<string> | string,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: true;
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: false;
    }
  ): void;

  (
    args: Array<string> | string,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: false;
    }
  ):
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  (
    args: Array<string> | string,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
    }
  ):
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  (
    args: Array<string> | string,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: true;
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: true;
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string> | string,
    options: BaseExecOptions & {
      /**
       * If true, stdout and stderr will be collected into strings and returned
       * instead of being printed to the screen.
       *
       * Defaults to false.
       */
      captureOutput: true;
    }
  ): { stdout: string; stderr: string };

  (
    args: Array<string> | string,
    options: BaseExecOptions & {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
      captureOutput: true;
    }
  ):
    | { stdout: string; stderr: string; status: number; signal: undefined }
    | { stdout: string; stderr: string; status: undefined; signal: number };

  /** Log all executed commands to stderr. `isOn` is optional and defaults to `true`. Pass `false` to disable logging. */
  enableLogging(isOn?: boolean): void;
}

/** Run a child process using the provided arguments. The first value in the arguments array is the program to run. */
declare const exec: Exec;

/** Alias for `exec(args, { captureOutput: true })` */
declare function $(args: Array<string> | string): {
  stdout: string;
  stderr: string;
};
