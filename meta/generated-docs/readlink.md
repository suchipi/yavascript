- [readlink (function)](#readlink-function)

# readlink (function)

Reads a symlink.

Returns the target of the symlink, which may be absolute or relative.

Provides the same functionality as the unix binary of the same name.

```ts
declare function readlink(path: string | Path): Path;
```
