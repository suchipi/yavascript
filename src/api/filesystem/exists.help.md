`exists` - Check if a file/folder exists

Returns true if a file or directory exists at the specified path.

Provides the same functionality as the command `test -e`.

```ts
// Defined in yavascript/src/api/filesystem/exists.ts
declare function exists(path: string | Path): boolean;
```
