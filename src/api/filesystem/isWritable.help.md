`isWritable` - Returns whether a given path can be written to

`isWritable` is a function which returns a boolean indicating whether the current user can write to a resource at the provided path.

```ts
// Defined in yavascript/src/api/filesystem/isWritable.ts
declare function isWritable(path: string | Path): boolean;
```
