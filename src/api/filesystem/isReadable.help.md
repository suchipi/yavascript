`isReadable` - Returns whether a given path can be read

`isReadable` is a function which returns a boolean indicating whether the current user can read the resource at the provided path.

If the resource does not exist, an error will be thrown.

```ts
// Defined in yavascript/src/api/filesystem/isReadable.ts
declare function isReadable(path: string | Path): boolean;
```
