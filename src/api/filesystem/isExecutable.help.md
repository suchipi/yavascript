# `isExecutable` - Returns whether a given path can be run

`isExecutable` is a function which returns a boolean indicating whether the current user can execute the resource at the provided path.

If the resource does not exist, an error will be thrown.

```ts
// Defined in yavascript/src/api/filesystem/isExecutable.ts
declare function isExecutable(path: string | Path): boolean;
```
