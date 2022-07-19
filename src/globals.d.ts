declare const env: { [key: string]: string | undefined };

interface Exec {
  (args: Array<string>): void;

  (args: Array<string>, options: Record<string, never>): void;

  (
    args: Array<string>,
    options: {
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
    args: Array<string>,
    options: {
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
  ): { status: number };

  (
    args: Array<string>,
    options: {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
    }
  ): { status: number };

  (
    args: Array<string>,
    options: {
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
    args: Array<string>,
    options: {
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
    args: Array<string>,
    options: {
      /**
       * Whether an Error should be thrown when the process exits with a nonzero
       * status code.
       *
       * Defaults to true.
       */
      failOnNonZeroStatus: false;
      captureOutput: true;
    }
  ): { stdout: string; stderr: string; status: number };
}

/** Run a child process using the provided arguments. The first value in the arguments array is the program to run. */
declare const exec: Exec;

/** Alias for `exec(args, { captureOutput: true, failOnNonZeroStatus: false })` */
declare function $(args: Array<string>): {
  stdout: string;
  stderr: string;
  status: number;
};

/** Read the contents of a file from disk, as a string. */
declare function readFile(path: string): string;

declare function writeFile(path: string, data: string | ArrayBuffer): void;

declare function isDir(path: string): boolean;

declare function remove(path: string): void;

declare function exists(path: string): boolean;

declare function cd(path: string): void;

declare function pwd(): string;

declare function glob(...inputs: Array<string>): Array<string>;

declare const echo: typeof console.log;

declare function inspect(value: any): string;

declare function stripAnsi(input: string): string;

declare function quote(input: string): string;

// Colors
declare function black(input: string | number): string;
declare function red(input: string | number): string;
declare function green(input: string | number): string;
declare function yellow(input: string | number): string;
declare function blue(input: string | number): string;
declare function magenta(input: string | number): string;
declare function cyan(input: string | number): string;
declare function white(input: string | number): string;
declare function gray(input: string | number): string;
declare function grey(input: string | number): string;

// Background Colors
declare function bgBlack(input: string | number): string;
declare function bgRed(input: string | number): string;
declare function bgGreen(input: string | number): string;
declare function bgYellow(input: string | number): string;
declare function bgBlue(input: string | number): string;
declare function bgMagenta(input: string | number): string;
declare function bgCyan(input: string | number): string;
declare function bgWhite(input: string | number): string;

// Modifiers
declare function reset(input: string | number): string;
declare function bold(input: string | number): string;
declare function dim(input: string | number): string;
declare function italic(input: string | number): string;
declare function underline(input: string | number): string;
declare function inverse(input: string | number): string;
declare function hidden(input: string | number): string;
declare function strikethrough(input: string | number): string;
