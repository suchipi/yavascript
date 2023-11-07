# `stripAnsi` - remove ANSI control sequences from string

The `stripAnsi` function removes ANSI control characters from a string, such as those added by string styling functions like `bold()`, `red()`, or `bgBlue()`.

```ts
// Defined in yavascript/src/api/strings
declare function stripAnsi(input: string): string;
```
