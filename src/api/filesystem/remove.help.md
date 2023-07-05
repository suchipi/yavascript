`remove` - Delete files/folders

Delete the file or directory at the specified path.

If the directory isn't empty, its contents will be deleted, too.

Provides the same functionality as the command `rm -rf`.

```ts
// Defined in yavascript/src/api/filesystem/remove.ts
declare function remove(path: string | Path): void;
```
