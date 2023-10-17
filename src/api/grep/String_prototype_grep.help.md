# `String.prototype.grep` - returns lines in string matching pattern

The `String.prototype.grep` method splits the string on `\n` and then returns the lines matching the specified pattern, as an array of strings.

If the `{ details: true }` option is set, the returned array contains objects with info about the match, instead of strings.

```ts
// Defined in yavascript/src/api/grep
declare function String.prototype.grep(
  pattern: string | RegExp,
  options?: { inverse?: boolean; details?: boolean }
):
  | Array<string>
  | Array<{
      lineNumber: number;
      lineContent: string;
      matches: RegExpMatchArray;
    }>;
```

See also `help(grepString)` and `help(grepFile)`.
