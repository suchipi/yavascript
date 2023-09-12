`grepString` - returns lines in string matching pattern

The `grepString` function splits the string passed into it on `\n` and then returns the lines matching the specified pattern, as an array of strings.

If the `{ details: true }` option is set, the returned array contains objects with info about the match, instead of strings.

```ts
// Defined in yavascript/src/api/grep
declare function grepString(
  str: string,
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

See also `help(grepFile)` and `help(String.prototype.grep)`.
