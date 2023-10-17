# `grepFile` - returns lines in file matching pattern

The `grepFile` function reads a file, splits it on `\n`, and then returns the lines matching the specified pattern, as an array of strings.

If the `{ details: true }` option is set, the returned array contains objects with info about the match, instead of strings.

```ts
// Defined in yavascript/src/api/grep
declare function grepFile(
  path: string | Path,
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

See also `help(grepString)` and `help(String.prototype.grep)`.
