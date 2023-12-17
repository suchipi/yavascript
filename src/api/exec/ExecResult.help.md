# `ExecResult` - object returned from `exec` and `$`

When `exec()` or `$()` are called, they return an object which is an instance of the "ExecResult" class. This class contains information about the child process that `exec` or `$` spawned.

The TypeScript type for ExecResult has two generics. The first, `StdioType`, indicates the return type of the `stdout` and `stderr` getters on the ExecResult, and corresponds to exec's "captureOutput" option. The second generic, `Finished`, is a boolean which indicates whether the underlying process is no longer running.

If you attempt to access the `stdout`, `stderr`, `status`, or `signal` properties on an ExecResult whose corresponding child process hasn't yet finished, an error will be thrown. The second generic serves to illustrate this difference; those properties are typed as `never` on "unfinished" ExecResults, but have usable types on "finished" ExecResults.

When using `exec`, the ExecResult is returned before the child process has finished, so the second generic is `false`. When using `$`, the ExecResult is returned _after_ synchronously waiting for the child process, so the second generic is `true`.

To convert an "unfinished" ExecResult into a "finished" one, call its `.wait()` method, which synchronously blocks the calling thread until the child process has completed.

```ts
// Defined in yavascript/src/api/exec/ExecResult.ts
declare class ExecResult<
  StdioType extends ArrayBuffer | string | never,
  Finished extends boolean = false
> {
  wait(): ExecResult<StdioType, true>;

  get stdout(): Finished extends true ? StdioType : never;
  get stderr(): Finished extends true ? StdioType : never;
  get status(): Finished extends true ? number | undefined : never;
  get signal(): Finished extends true ? number | undefined : never;

  constructor(init: {
    child: ChildProcess;
    stdioType: StdioType extends ArrayBuffer
      ? "arraybuffer"
      : StdioType extends string
      ? "utf8"
      : null;
    trace?: undefined | null | ((...args: Array<any>) => void);
  });

  child: ChildProcess;
  stdioType: StdioType extends ArrayBuffer
    ? "arraybuffer"
    : StdioType extends string
    ? "utf8"
    : null;
}
```
