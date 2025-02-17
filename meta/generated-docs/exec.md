# BaseExecOptions (type)

```ts
declare type BaseExecOptions = {
  cwd?: string | Path;
  env?: {
    [key: string | number]: string | number | boolean;
  };
  logging?: {
    trace?: (...args: Array<any>) => void;
    info?: (...args: Array<any>) => void;
  };
  failOnNonZeroStatus?: boolean;
  captureOutput?: boolean | "utf8" | "arraybuffer";
  block?: boolean;
};
```

## BaseExecOptions.cwd (property)

Sets the current working directory for the child process.

```ts
cwd?: string | Path;
```

## BaseExecOptions.env (object property)

Sets environment variables within the process.

```ts
env?: {
  [key: string | number]: string | number | boolean;
};
```

## BaseExecOptions.logging (object property)

Options which control logging.

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
  info?: (...args: Array<any>) => void;
};
```

### BaseExecOptions.logging.trace (function property)

If provided, this logging function will be called multiple times as
`exec` runs, to help you understand what's going on and/or troubleshoot
things. In most cases, it makes sense to use a function from `console`
here, like so:

```js
exec(["echo", "hi"], {
  logging: { trace: console.log },
});
```

Defaults to the current value of [logger.trace](#). `logger.trace`
defaults to a no-op function.

```ts
trace?: (...args: Array<any>) => void;
```

### BaseExecOptions.logging.info (function property)

An optional, user-provided logging function to be used for informational
messages. Less verbose than `logging.trace`.

Defaults to the current value of [logger.info](#). `logger.info`
defaults to a function which logs to stderr.

```ts
info?: (...args: Array<any>) => void;
```

## BaseExecOptions.failOnNonZeroStatus (boolean property)

Whether an Error should be thrown when the process exits with a nonzero
status code.

Defaults to true.

```ts
failOnNonZeroStatus?: boolean;
```

## BaseExecOptions.captureOutput (property)

If true, stdout and stderr will be collected into strings or array buffers
and returned instead of being printed to the screen.

Defaults to false. true is an alias for "utf8".

```ts
captureOutput?: boolean | "utf8" | "arraybuffer";
```

## BaseExecOptions.block (boolean property)

If true, exec doesn't return until the process is done running. If false,
exec returns an object with a "wait" method which can be used to wait for
the process to be done running.

Defaults to true.

```ts
block?: boolean;
```

# ExecWaitResult (type)

```ts
type ExecWaitResult<ExecOptions extends BaseExecOptions> = ExecOptions extends
  | {
      captureOutput: true | "utf8" | "arraybuffer";
    }
  | {
      failOnNonZeroStatus: false;
    }
  ? (ExecOptions["captureOutput"] extends true | "utf8"
      ? {
          stdout: string;
          stderr: string;
        }
      : {}) &
      (ExecOptions["captureOutput"] extends "arraybuffer"
        ? {
            stdout: ArrayBuffer;
            stderr: ArrayBuffer;
          }
        : {}) &
      (ExecOptions["failOnNonZeroStatus"] extends false
        ?
            | {
                status: number;
                signal: undefined;
              }
            | {
                status: undefined;
                signal: number;
              }
        : {})
  : void;
```

# Exec (interface)

```ts
declare interface Exec {
  <
    ExecOptions extends BaseExecOptions = {
      failOnNonZeroStatus: true;
      captureOutput: false;
      block: true;
    },
  >(
    args: Array<string | Path | number> | string | Path,
    options?: ExecOptions,
  ): ExecOptions["block"] extends false
    ? {
        wait(): ExecWaitResult<ExecOptions>;
      }
    : ExecWaitResult<ExecOptions>;
  toArgv(args: Array<string | Path | number> | string | Path): Array<string>;
}
```

## Exec(...) (call signature)

```ts
<ExecOptions extends BaseExecOptions = {
  failOnNonZeroStatus: true;
  captureOutput: false;
  block: true;
}>(args: Array<string | Path | number> | string | Path, options?: ExecOptions): ExecOptions["block"] extends false ? {
  wait(): ExecWaitResult<ExecOptions>;
} : ExecWaitResult<ExecOptions>;
```

## Exec.toArgv (method)

Parse the provided value into an array of command-line argument strings,
using the same logic that [exec](#) and [ChildProcess](#) use.

```ts
toArgv(args: Array<string | Path | number> | string | Path): Array<string>;
```

# exec (Exec)

Runs a child process using the provided arguments.

The first value in the arguments array is the program to run.

```ts
const exec: Exec;
```

# $ (function)

Alias for `exec(args, { captureOutput: true })`

```ts
declare function $(args: Array<string | Path | number> | string | Path): {
  stdout: string;
  stderr: string;
};
```
