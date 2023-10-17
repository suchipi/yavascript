# `ls` - Return directory contents

Returns the contents of a directory, as absolute paths. `.` and `..` are omitted.

```ts
// Defined in yavascript/src/api/commands/ls
declare function ls(dir?: string | Path): Array<Path>;
```
