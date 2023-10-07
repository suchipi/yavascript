/** A class which represents a child process. The process may or may not be running. */
declare interface ChildProcess {
  /**
   * The argv for the process. The first entry in this array is the program to
   * run.
   */
  args: Array<string>;

  /** The current working directory for the process. */
  cwd: string;

  /** The environment variables for the process. */
  env: { [key: string]: string };

  /**
   * The standard I/O streams for the process. Generally these are the same as
   * `std.in`, `std.out`, and `std.err`, but they can be customized to write
   * output elsewhere.
   */
  stdio: {
    /** Where the process reads stdin from */
    in: FILE;
    /** Where the process writes stdout to */
    out: FILE;
    /** Where the process writes stderr to */
    err: FILE;
  };

  /**
   * Optional trace function which, if present, will be called at various times
   * to provide information about the lifecycle of the process.
   */
  trace?: (...args: Array<any>) => void;

  pid: number | null;

  /** Spawns the process and returns its pid (process id). */
  start(): number;

  /** Blocks the calling thread until the process exits or is killed. */
  waitUntilComplete():
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };
}

/**
 * Options to be passed to the ChildProcess constructor. Their purposes and
 * types match the same-named properties found on the resulting ChildProcess.
 */
declare type ChildProcessOptions = {
  /** The current working directory for the process. */
  cwd?: string;

  /** The environment variables for the process. */
  env?: { [key: string]: string };

  /**
   * The standard I/O streams for the process. Generally these are the same as
   * `std.in`, `std.out`, and `std.err`, but they can be customized to write
   * output elsewhere.
   */
  stdio?: {
    /** Where the process reads stdin from */
    in?: FILE;
    /** Where the process writes stdout to */
    out?: FILE;
    /** Where the process writes stderr to */
    err?: FILE;
  };

  /**
   * Optional trace function which, if present, will be called at various times
   * to provide information about the lifecycle of the process.
   */
  trace?: (...args: Array<any>) => void;
};

declare interface ChildProcessConstructor {
  /**
   * Construct a new ChildProcess.
   *
   * @param args - The argv for the process. The first entry in this array is the program to run.
   * @param options - Options for the process (cwd, env, stdio, etc)
   */
  new (
    args: string | Path | Array<string | number | Path>,
    options?: ChildProcessOptions
  ): ChildProcess;

  readonly prototype: ChildProcess;
}

declare var ChildProcess: ChildProcessConstructor;
