`isDir` - Returns whether a given path is a folder

`isDir` is a function which returns true if there is a directory at the provided path, or if there is a symlink at the provided path which points to a directory. Otherwise, it returns false.

```ts
// Defined in yavascript/src/api/filesystem/isDir.ts
declare function isDir(path: string | Path): boolean;
```
