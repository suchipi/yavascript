# `ls` - Return directory contents

Returns the contents of a directory, as an Array of absolute paths. `.` and `..` are omitted.

If `ls()` is called with no directory, the present working directory (`pwd()`) is used.

```ts
// Defined in yavascript/src/api/commands/ls
declare function ls(dir?: string | Path): Array<Path>;
```
