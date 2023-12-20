# `exec` - Run system commands via child processes

The `exec` function runs a child process. You can call it with either a string or an array of strings.

```ts
exec(`echo hello`);
exec(["echo", "hello"]);
```

To block until the child process is done running, add `.wait()` to the end:

```ts
exec(`echo hello`).wait();
exec(["echo", "hello"]).wait();
```

When calling `exec` with an array of strings, the first string in the array is the program to run, and the rest of the strings in the array are arguments to the program.

When calling with a string instead of an array, the string will be split into separate arguments using the following rules:

- The program and its arguments will be determined by splitting the input string on whitespace, except:
  - Stuff in single or double-quotes will be preserved as a single argument
  - Double and single quotes can be "glued" together (eg `"bla"'bla'` becomes `blabla`)
  - The escape sequences `\n`, `\r`, `\t`, `\v`, `\0`, and `\\` can be used inside of quotes get replaced with newline, carriage return, tab, vertical tab, nul, and `\` characters, respectively

For example:

```ts
exec(`echo hi there`); // -> ["echo", "hi", "there"]
exec(`printf "something with spaces\n"`); // -> ["printf", "something with spaces\n"]
```

The intent is that it behaves similarly to what you would expect from a UNIX shell, but only the "safe" features. "Unsafe" features like environment variable expansion (`$VAR` or `${VAR}`), subshells (\`echo hi\` or `$(echo hi)`), and redirection (`> /dev/null` or `2>&1 `) are not supported. To use those features, shell out to `bash` or `sh` directly via eg `exec(['bash', '-c', 'your command string'])`, but be aware of the security implications of doing so.

`exec` also supports a second argument, an options object which supports the following keys (all are optional):

| Property                       | Purpose                                         |
| ------------------------------ | ----------------------------------------------- |
| cwd (string)                   | current working directory for the child process |
| env (object)                   | environment variables for the process           |
| captureOutput (boolean/string) | controls how stdout/stderr is directed          |
| trace (function)               | used to log info about the process execution    |

The return value of `exec` is an 'ExecResult' object, which has the following notable properties:

| Property                        | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| wait (Function)                 | wait until the child process has finished                     |
| stdout (string or ArrayBuffer)  | data the child process emitted to stdout                      |
| stderr (string or ArrayBuffer)  | data the child process emitted to stderr                      |
| signal (number or undefined)    | signal the child process exited with                          |
| status (number or undefined)    | exit status code the child process exited with                |
| assertExitStatusZero (Function) | throw an error if the child process's exit status wasn't zero |

The type of `stdout` and `stderr` depends on the value of the `captureOutput` option passed into `exec`. If captureOutput is `true` or "utf8", stdout and stderr will be strings. If captureOutput is "arraybuffer", stdout and stderr will be ArrayBuffers. Otherwise, attempting to access the `stdout`/`stderr` properties will throw an error.

When present, the signal number will match one of the signal number constants on the `os` global; `os.SIGTERM`, `os.SIGINT`, etc.

```ts
// Defined in yavascript/src/api/exec
declare function exec(
  args: string | Path | Array<string | Path | number>,
  options?: {
    /** Defaults to `pwd()` */
    cwd?: string | Path;

    /** Defaults to `env` */
    env?: { [key: string | number]: string | number | boolean };

    /** Defaults to `undefined` */
    trace?: (...args: Array<any>) => void;

    /** Defaults to false */
    captureOutput?: boolean | "utf8" | "arraybuffer";
  }
): ExecResult<string | ArrayBuffer | never>;

// Converts `args` to an Array<string> using the same logic `exec` does.
declare function exec.toArgv(
  args: string | Path | Array<string | Path | number>,
): Array<string>;
```
