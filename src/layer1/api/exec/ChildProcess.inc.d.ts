/**
 * A class which represents a child process. The process may or may not be
 * running.
 *
 * This class is the API used internally by the {@link exec} function to spawn child
 * processes.
 *
 * Generally, you should not need to use the `ChildProcess` class directly, and
 * should use {@link exec} or {@link $} instead. However, you may need to use it in some
 * special cases, like when specifying custom stdio for a process, or spawning a
 * non-blocking long-running process.
 *
 * **Example**
 * ```ts
 * const child = new ChildProcess(["echo", "hi"]);
 * child.start();
 * child.waitUntilComplete();
 * ```
 */
declare interface ChildProcess {
  /**
   * The argv for the process. The first entry in this array is the program to
   * run.
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess("echo hi there");
   * console.log(child.args);
   * ```
   */
  args: Array<string>;

  /**
   * The current working directory for the process.
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["ls"], { cwd: "src" });
   * console.log(child.cwd.toString());
   * ```
   */
  cwd: Path;

  /**
   * The environment variables for the process.
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["printenv", "GREETING"]);
   * child.env.GREETING = "hello";
   * child.start();
   * child.waitUntilComplete();
   * ```
   */
  env: { [key: string]: string };

  /**
   * The standard I/O streams for the process. Generally these are the same as
   * `std.in`, `std.out`, and `std.err`, but they can be customized to write
   * output elsewhere.
   *
   * **Example**
   * ```ts
   * const logFile = std.open("output.log", "w");
   * const child = new ChildProcess(["echo", "hi"]);
   * child.stdio.out = logFile;
   * child.stdio.err = logFile;
   * child.start();
   * child.waitUntilComplete();
   * logFile.close();
   * ```
   */
  stdio: {
    /**
     * Where the process reads stdin from
     *
     * **Example**
     * ```ts
     * const child = new ChildProcess(["cat"]);
     * child.stdio.in = std.open("notes.txt", "r");
     * child.start();
     * child.waitUntilComplete();
     * ```
     */
    in: FILE;
    /**
     * Where the process writes stdout to
     *
     * **Example**
     * ```ts
     * const child = new ChildProcess(["date"]);
     * child.stdio.out = std.open("date.txt", "w");
     * child.start();
     * child.waitUntilComplete();
     * ```
     */
    out: FILE;
    /**
     * Where the process writes stderr to
     *
     * **Example**
     * ```ts
     * const child = new ChildProcess(["ls", "does-not-exist"]);
     * child.stdio.err = std.open("errors.log", "w");
     * child.start();
     * child.waitUntilComplete();
     * ```
     */
    err: FILE;
  };

  get state(): ChildProcessState;
  get pid(): number | null;

  /**
   * Spawns the process and returns its pid (process id).
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["sleep", "1"]);
   * const pid = child.start();
   * console.log(pid);
   * ```
   */
  start(): number;

  /**
   * Blocks the calling thread until the process exits or is killed.
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["sleep", "1"]);
   * child.start();
   * const { status, signal } = child.waitUntilComplete();
   * console.log(status, signal);
   * ```
   */
  waitUntilComplete():
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };
}

declare type ChildProcessState =
  | {
      id: "UNSTARTED";
    }
  | {
      id: "STARTED";
      pid: number;
    }
  | {
      id: "STOPPED";
      pid: number;
    }
  | {
      id: "CONTINUED";
      pid: number;
    }
  | {
      id: "EXITED";
      oldPid: number;
      status: number;
    }
  | {
      id: "SIGNALED";
      oldPid: number;
      signal: number;
    };

/**
 * Options to be passed to the ChildProcess constructor. Their purposes and
 * types match the same-named properties found on the resulting ChildProcess.
 *
 * **Example**
 * ```ts
 * const options: ChildProcessOptions = {
 *   cwd: "src",
 *   env: { GREETING: "hello" },
 * };
 * const child = new ChildProcess(["printenv", "GREETING"], options);
 * ```
 */
declare type ChildProcessOptions = {
  /**
   * The current working directory for the process.
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["ls"], { cwd: "src" });
   * child.start();
   * child.waitUntilComplete();
   * ```
   */
  cwd?: string | Path;

  /**
   * The environment variables for the process.
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["printenv", "GREETING"], {
   *   env: { GREETING: "hello" },
   * });
   * child.start();
   * child.waitUntilComplete();
   * ```
   */
  env?: { [key: string]: string };

  /**
   * The standard I/O streams for the process. Generally these are the same as
   * `std.in`, `std.out`, and `std.err`, but they can be customized to write
   * output elsewhere.
   *
   * **Example**
   * ```ts
   * const logFile = std.open("output.log", "w");
   * const child = new ChildProcess(["echo", "hi"], {
   *   stdio: { out: logFile, err: logFile },
   * });
   * child.start();
   * child.waitUntilComplete();
   * logFile.close();
   * ```
   */
  stdio?: {
    /**
     * Where the process reads stdin from
     *
     * **Example**
     * ```ts
     * const child = new ChildProcess(["cat"], {
     *   stdio: { in: std.open("notes.txt", "r") },
     * });
     * child.start();
     * child.waitUntilComplete();
     * ```
     */
    in?: FILE;
    /**
     * Where the process writes stdout to
     *
     * **Example**
     * ```ts
     * const child = new ChildProcess(["date"], {
     *   stdio: { out: std.open("date.txt", "w") },
     * });
     * child.start();
     * child.waitUntilComplete();
     * ```
     */
    out?: FILE;
    /**
     * Where the process writes stderr to
     *
     * **Example**
     * ```ts
     * const child = new ChildProcess(["ls", "does-not-exist"], {
     *   stdio: { err: std.open("errors.log", "w") },
     * });
     * child.start();
     * child.waitUntilComplete();
     * ```
     */
    err?: FILE;
  };

  /**
   * Options which control logging
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["echo", "hi"], {
   *   logging: { trace: console.error },
   * });
   * ```
   */
  logging?: {
    /**
     * Optional trace function which, if present, will be called at various
     * times to provide information about the lifecycle of the process.
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a function which writes to stderr.
     *
     * **Example**
     * ```ts
     * const child = new ChildProcess(["echo", "hi"], {
     *   logging: { trace: (...args) => console.error("[child]", ...args) },
     * });
     * child.start();
     * child.waitUntilComplete();
     * ```
     */
    trace?: (...args: Array<any>) => void;
  };
};

declare interface ChildProcessConstructor {
  /**
   * Construct a new ChildProcess.
   *
   * @param args - The argv for the process. The first entry in this array is the program to run.
   * @param options - Options for the process (cwd, env, stdio, etc)
   *
   * **Example**
   * ```ts
   * const child = new ChildProcess(["ls", "-la"], { cwd: "src" });
   * child.start();
   * child.waitUntilComplete();
   * ```
   */
  new (
    args: string | Path | Array<string | number | Path>,
    options?: ChildProcessOptions,
  ): ChildProcess;

  readonly prototype: ChildProcess;
}

declare var ChildProcess: ChildProcessConstructor;
