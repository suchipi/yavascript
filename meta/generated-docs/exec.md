- [exec (Exec)](#exec-exec)
- [BaseExecOptions (type)](#baseexecoptions-type)
  - [BaseExecOptions.cwd (property)](#baseexecoptionscwd-property)
  - [BaseExecOptions.env (object property)](#baseexecoptionsenv-object-property)
  - [BaseExecOptions.logging (object property)](#baseexecoptionslogging-object-property)
    - [BaseExecOptions.logging.trace (function property)](#baseexecoptionsloggingtrace-function-property)
    - [BaseExecOptions.logging.info (function property)](#baseexecoptionslogginginfo-function-property)
  - [BaseExecOptions.failOnNonZeroStatus (boolean property)](#baseexecoptionsfailonnonzerostatus-boolean-property)
  - [BaseExecOptions.captureOutput (property)](#baseexecoptionscaptureoutput-property)
  - [BaseExecOptions.block (boolean property)](#baseexecoptionsblock-boolean-property)
- [Exec (interface)](#exec-interface)
  - [Exec(...) (call signature)](#exec-call-signature)
  - [Exec.toArgv (method)](#exectoargv-method)
- [$ (function)](#-function)
- [ExecWaitResult (type)](#execwaitresult-type)

# exec (Exec)

Runs a child process and blocks until it exits. You can call it with either a
string or an array of strings.

When calling `exec` with an array of strings, the first string in the array
is the program to run, and the rest of the strings in the array are arguments
to the program, eg:

```ts
exec(["echo", "hi", "there"]);
exec(["printf", "something with spaces\n"]);
```

When calling with a string instead of an array, the string will be split into
separate arguments using the following rules:

- The program and its arguments will be determined by splitting the input
  string on whitespace, except:
  - Stuff in single or double-quotes will be preserved as a single argument
  - Double and single quotes can be "glued" together (eg `"bla"'bla'` becomes
    `blabla`)
  - The escape sequences `\n`, `\r`, `\t`, `\v`, `\0`, and `\\` can be used
    inside of quotes get replaced with newline, carriage return, tab,
    vertical tab, nul, and `\` characters, respectively

For example:

```ts
exec(`echo hi there`);
exec(`printf "something with spaces\n"`);
```

The intent is that it behaves similarly to what you would expect from a UNIX
shell, but only the "safe" features. "Unsafe" features like environment
variable expansion (`$VAR` or `${VAR}`), subshells (\`echo hi\` or `$(echo
hi)`), and redirection (`> /dev/null` or `2>&1 `) are not supported. To use
those features, shell out to `bash` or `sh` directly via eg `exec(['bash',
'-c', 'your command string'])`, but be aware of the security implications of
doing so.

`exec` also supports a second argument, an options object which supports the
following keys (all are optional):

| Property                       | Purpose                                             |
| ------------------------------ | --------------------------------------------------- |
| cwd (string)                   | current working directory for the child process     |
| env (object)                   | environment variables for the process               |
| failOnNonZeroStatus (boolean)  | whether to throw error on nonzero exit status       |
| captureOutput (boolean/string) | controls how stdout/stderr is directed              |
| logging (object)               | controls how/whether info messages are logged       |
| block (boolean)                | whether to wait for child process exit now or later |

The return value of `exec` varies depending on the options passed:

- When `captureOutput` is true or "utf-8", an object will be returned with
  `stdout` and `stderr` properties, both strings.
- When `captureOutput` is "arraybuffer", an object will be returned with
  `stdout` and `stderr` properties, both `ArrayBuffer`s.
- When `failOnNonZeroStatus` is false, an object will be returned with
  `status` (the exit code; number or undefined) and `signal` (the signal that
  killed the process; number or undefined).
- When `captureOutput` is non-false and `failOnNonZeroStatus` is false, an
  object will be returned with four properties (the two associated with
  `failOnNonZeroStatus`, and the two associated with `captureOutput`).
- When `captureOutput` is false or unspecified, and `failOnNonZeroStatus` is
  true or unspecified, undefined will be returned.
- If `block` is false, an object with a "wait" method is returned instead,
  which blocks the calling thread until the process exits, and then returns
  one of the values described above.

```ts
const exec: Exec;
```

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

Defaults to the current value of [logger.trace](/meta/generated-docs/logger.md#loggertrace-function-property). `logger.trace`
defaults to a no-op function.

```ts
trace?: (...args: Array<any>) => void;
```

### BaseExecOptions.logging.info (function property)

An optional, user-provided logging function to be used for informational
messages. Less verbose than `logging.trace`.

Defaults to the current value of [logger.info](/meta/generated-docs/logger.md#loggerinfo-function-property). `logger.info`
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

Runs a child process using the provided arguments.

When `args` is an Array, the first value in the Array is the program to
run.

- `@param` _args_ — The command to run.
- `@param` _options_ — Options; see [BaseExecOptions](/meta/generated-docs/exec.md#baseexecoptions-type)

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
using the same logic that [exec](/meta/generated-docs/exec.md#exec-interface) and [ChildProcess](/meta/generated-docs/ChildProcess.md#childprocess-interface) use.

```ts
toArgv(args: Array<string | Path | number> | string | Path): Array<string>;
```

# $ (function)

`$(...)` is an alias for `exec(..., { captureOutput: true, failOnNonZeroStatus: true })`.

It's often used to capture the output of a program:

```ts
const result = $(`echo hi`).stdout;
// result is 'hi\n'
```

For more info, see [exec](/meta/generated-docs/exec.md#exec-interface).

```ts
declare function $(args: Array<string | Path | number> | string | Path): {
  stdout: string;
  stderr: string;
};
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
