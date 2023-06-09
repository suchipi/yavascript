`ls` - Return directory contents

Returns the contents of a directory, as absolute paths. `.` and `..` are omitted.

Use the `relativePaths` option to get relative paths instead (relative to the parent directory).

```ts
// Defined in yavascript/src/api/commands/ls.ts
declare function ls(
  dir?: string | Path,
  options?: { relativePaths?: boolean }
): Array<string>;
```
