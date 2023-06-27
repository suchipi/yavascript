`isDir` - Returns whether a given path is a folder

`isDir` is a function which returns true if there is a directory at the provided path, or if there is a symlink at the provided path which points to a directory. Otherwise, it returns false.

`isDir` will follow up to `isDir.symlinkLimit` symlinks in order to check if a symlink eventually points to a folder. This number defaults to 100, but you can set it to any number you wish.

```ts
// Defined in yavascript/src/api/filesystem
declare const isDir: {
  (path: string | Path): boolean;
  symlinkLimit: number;
};
```
