- [touch (function)](#touch-function)

# touch (function)

If the file at `path` exists, update its creation/modification timestamps.

Otherwise, create an empty file at that path.

- `@param` _path_ — The target path for the file.

```ts
declare function touch(path: string | Path): void;
```
