# `writeFile` - Write data to a file on disk

`writeFile` is a function which writes the provided data to a file on disk. The data can be either a string or an ArrayBuffer.

Strings are written using the UTF-8 encoding.

```ts
// Defined in yavascript/src/api/filesystem/writeFile.ts
declare function writeFile(
  path: string | Path,
  data: string | ArrayBuffer
): void;
```
