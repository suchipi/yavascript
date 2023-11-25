# `cat` - Read files from disk

Reads the contents of one or more files from disk as one UTF-8 string or ArrayBuffer.

Provides the same functionality as the unix binary of the same name.

```ts
// Defined in yavascript/src/api/commands/cat
declare function cat(
  paths: string | Path | Array<string | Path>,
  options?: { binary: true }
): string | ArrayBuffer;
```
