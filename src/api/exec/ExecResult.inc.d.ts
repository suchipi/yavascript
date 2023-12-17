declare class ExecResult<
  StdioType extends ArrayBuffer | string | never,
  Completed extends boolean = false
> {
  wait(): ExecResult<StdioType, true>;

  /**
   * The stdout from the child process.
   *
   * Call `.wait()` before invoking this getter, or else an error will be
   * thrown. You can chain off of `.wait()`, ie: `result.wait().stdout`
   */
  get stdout(): Completed extends true ? StdioType : never;
  /**
   * The stderr from the child process.
   *
   * Call `.wait()` before invoking this getter, or else an error will be
   * thrown. You can chain off of `.wait()`, ie: `result.wait().stderr`
   */
  get stderr(): Completed extends true ? StdioType : never;
  /**
   * The exit status code from the child process, or undefined if it exited
   * abnormally or failed to start.
   *
   * Call `.wait()` before invoking this getter, or else an error will be
   * thrown. You can chain off of `.wait()`, ie: `result.wait().status`
   */
  get status(): Completed extends true ? number | undefined : never;
  /**
   * The signal the child process exited with, or undefined if it didn't exit
   * due to receiving a signal.
   *
   * Call `.wait()` before invoking this getter, or else an error will be
   * thrown. You can chain off of `.wait()`, ie: `result.wait().signal`
   */
  get signal(): Completed extends true ? number | undefined : never;

  stdioType: StdioType extends ArrayBuffer
    ? "arraybuffer"
    : StdioType extends string
    ? "utf8"
    : null;

  constructor(init: {
    child: ChildProcess;
    stdioType: StdioType extends ArrayBuffer
      ? "arraybuffer"
      : StdioType extends string
      ? "utf8"
      : null;
    trace?: undefined | null | ((...args: Array<any>) => void);
  });
}
