# `touch` - Create a file, or update its access/modified timestamp

If the file at `path` exists, update its creation/modification timestamps.

Otherwise, create an empty file at that path.

```ts
// Defined in yavascript/src/api/commands/touch
declare function touch(path: string | Path): void;
```
