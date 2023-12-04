# `mkdir` - Create a directory (folder)

Provides the same functionality as the unix binary of the same name.

```ts
// Defined in yavascript/src/api/commands/mkdir
declare function mkdir(
  path: string | Path,
  options?: { recursive?: boolean; mode?: number }
): void;
```
