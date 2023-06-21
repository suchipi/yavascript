`exec` - Run system commands via child processes

The `exec` function runs a child process. You can call it with either a string or an array of strings.

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

The intent is that it behaves similarly to what you would expect from a UNIX shell, but only the "safe" features. "Unsafe" features like environment variable expansion (`$VAR` or `${VAR}`), subshells (\`echo hi\` or `$(echo hi)`), and redirection (`> /dev/null` or `2>&1 `) are not supported. To use those features, shell out to `bash` or `sh` directly via eg `bash -c 'your command string'`, but be aware of the security implications of doing so.

WIP CONTINUE FROM HERE, EXPLAIN OPTIONS

```ts
// Defined in yavascript/src/api/env
declare const env: { [key: string]: string | undefined };
```
