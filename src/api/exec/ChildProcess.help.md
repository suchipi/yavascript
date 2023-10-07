`ChildProcess` - Run system commands via child processes

The `ChildProcess` class is the API used internally by the `exec` function to spawn child processes.

Generally, you should not need to use the `ChildProcess` class directly, and should use `exec` or `$` instead. However, you may need to use it in some special cases, like when specifying custom stdio for a process, or spawning a non-blocking long-running process.

```ts
// Defined in yavascript/src/api/exec/ChildProcess.ts
declare class ChildProcess {
  new(
    args: string | Path | Array<string | number | Path>,
    options?: {
      cwd?: string | Path;
      env?: { [key: string | number]: string | number | boolean };
      stdio?: {
        in?: FILE;
        out?: FILE;
        err?: FILE;
      };
      trace?: (...args: Array<any>) => void;
    }
  ): ChildProcess;

  args: Array<string>;
  cwd: Path;
  env: { [key: string]: string };

  stdio: {
    in: FILE;
    out: FILE;
    err: FILE;
  };
  trace?: (...args: Array<any>) => void;

  pid: number | null;
  start(): number;
  waitUntilComplete():
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };
}
```
