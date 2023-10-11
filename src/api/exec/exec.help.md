`exec` - Run system commands via child processes

The `exec` function runs a child process and blocks until it exits. You can call it with either a string or an array of strings.

When calling `exec` with an array of strings, the first string in the array is the program to run, and the rest of the strings in the array are arguments to the program, eg:

```ts
exec(["echo", "hi", "there"]);
exec(["printf", "something with spaces\n"]);
```

When calling with a string instead of an array, the string will be split into separate arguments using the following rules:

- The program and its arguments will be determined by splitting the input string on whitespace, except:
  - Stuff in single or double-quotes will be preserved as a single argument
  - Double and single quotes can be "glued" together (eg `"bla"'bla'` becomes `blabla`)
  - The escape sequences `\n`, `\r`, `\t`, `\v`, `\0`, and `\\` can be used inside of quotes get replaced with newline, carriage return, tab, vertical tab, nul, and `\` characters, respectively

For example:

```ts
exec(`echo hi there`);
exec(`printf "something with spaces\n"`);
```

The intent is that it behaves similarly to what you would expect from a UNIX shell, but only the "safe" features. "Unsafe" features like environment variable expansion (`$VAR` or `${VAR}`), subshells (\`echo hi\` or `$(echo hi)`), and redirection (`> /dev/null` or `2>&1 `) are not supported. To use those features, shell out to `bash` or `sh` directly via eg `exec(['bash', '-c', 'your command string'])`, but be aware of the security implications of doing so.

`exec` also supports a second argument, an options object which supports the following keys (all are optional):

| Property                       | Purpose                                         |
| ------------------------------ | ----------------------------------------------- |
| cwd (string)                   | current working directory for the child process |
| env (object)                   | environment variables for the process           |
| failOnNonZeroStatus (boolean)  | whether to throw error on nonzero exit status   |
| captureOutput (boolean/string) | controls how stdout/stderr is directed          |
| trace (function)               | used to log info about the process execution    |

The return value of `exec` varies depending on the options passed:

- When `captureOutput` is true or "utf-8", an object will be returned with `stdout` and `stderr` properties, both strings.
- When `captureOutput` is "arraybuffer", an object will be returned with `stdout` and `stderr` properties, both `ArrayBuffer`s.
- When `failOnNonZeroStatus` is false, an object will be returned with `status` (the exit code; number or undefined) and `signal` (the signal that killed the process; number or undefined).
- When `captureOutput` is non-false and `failOnNonZeroStatus` is false, an object will be returned with four properties (the two associated with `failOnNonZeroStatus`, and the two associated with `captureOutput`).
- When `captureOutput` is false or unspecified, and `failOnNonZeroStatus` is true or unspecified, undefined will be returned.

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

    /** Defaults to true */
    failOnNonZeroStatus?: boolean;

    /** Defaults to false */
    captureOutput?: boolean | "utf8" | "arraybuffer";
  }
);

// Converts `args` to an Array<string> using the same logic `exec` does.
declare function exec.toArgv(
  args: string | Path | Array<string | Path | number>,
): Array<string>;
```
