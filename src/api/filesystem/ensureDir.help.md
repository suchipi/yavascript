`ensureDir` - Ensures directories exist

Creates directories for each of the provided path components, if they don't already exist.

Provides the same functionality as the command `mkdir -p`.

```ts
// Defined in yavascript/src/api/filesystem/ensureDir.ts
declare function ensureDir(path: string | Path): string;
```
