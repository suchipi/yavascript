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

/** Write the contents of a string or ArrayBuffer to a file. */
declare function writeFile(path: string, data: string | ArrayBuffer): void;

/** Returns true if the path points to a directory, or if the path points to a symlink which points to a directory. */
declare function isDir(path: string): boolean;

/** Delete the file or directory at the specified path. If the directory isn't empty, its contents will be deleted, too. */
declare function remove(path: string): void;

/** Returns true if a file or directory exists at the specified path. */
declare function exists(path: string): boolean;

/** Change the process's current working directory to the specified path. */
declare function cd(path: string): void;

/** Return the process's current working directory. */
declare function pwd(): string;

/**
 * Search the filesystem for files matching the specified glob patterns. Uses [minimatch](https://www.npmjs.com/package/minimatch) with its default options.
 *
 * `followSymlinks` defaults to false.
 */
declare function glob(
  dir: string,
  patterns: Array<string>,
  options?: { followSymlinks?: boolean }
): Array<string>;

/** Print a value or values to stdout. */
declare const echo: typeof console.log;

/** Convert a value to a string, using the same logic as `echo` and `console.log`. */
declare function inspect(value: any): string;

/** Remove ANSI control characters from a string. */
declare function stripAnsi(input: string): string;

/** Wrap a string in double quotes, and escape any double-quotes inside with `\"`. */
declare function quote(input: string): string;

// Colors

/** Wrap a string with the ANSI control characters that will make it print as black text. */
declare function black(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as red text. */
declare function red(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as green text. */
declare function green(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as yellow text. */
declare function yellow(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as blue text. */
declare function blue(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as magenta text. */
declare function magenta(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as cyan text. */
declare function cyan(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as white text. */
declare function white(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as gray text. */
declare function gray(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print as grey text. */
declare function grey(input: string | number): string;

// Background Colors

/** Wrap a string with the ANSI control characters that will make it have a black background. */
declare function bgBlack(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a red background. */
declare function bgRed(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a green background. */
declare function bgGreen(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a yellow background. */
declare function bgYellow(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a blue background. */
declare function bgBlue(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a magenta background. */
declare function bgMagenta(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a cyan background. */
declare function bgCyan(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it have a white background. */
declare function bgWhite(input: string | number): string;

// Modifiers

/** Wrap a string with the ANSI control character that resets all styling. */
declare function reset(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print with a bold style. */
declare function bold(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print with a dimmed style. */
declare function dim(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print italicized. */
declare function italic(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print underlined. */
declare function underline(input: string | number): string;
/** Wrap a string with ANSI control characters such that its foreground (text) and background colors are swapped. */
declare function inverse(input: string | number): string;
/** Wrap a string with ANSI control characters such that it is hidden. */
declare function hidden(input: string | number): string;
/** Wrap a string with the ANSI control characters that will make it print with a horizontal line through its center. */
declare function strikethrough(input: string | number): string;
