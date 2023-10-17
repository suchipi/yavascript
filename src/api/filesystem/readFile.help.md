# `readFile` - Read the contents of a file on disk

`readFile` is a function which reads a file from disk and returns its contents. With no options specified, it reads the file as UTF-8 and returns a string:

```ts
const contents = readFile("README.md");
console.log(contents);
// "# yavascript\n\nYavaScript is a cross-platform bash-like script runner and repl which is distributed as a single\nstatically-linked binary..."
```

But, if you pass `{ binary: true }` as the second argument, it returns an ArrayBuffer containing the raw bytes from the file:

```ts
const contents = readFile("README.md", { binary: true });
console.log(contents);
// ArrayBuffer {
//   │0x00000000│ 23 20 79 61 76 61 73 63 72 69 70 74 0A 0A 59 61
//   │0x00000010│ 76 61 53 63 72 69 70 74 20 69 73 20 61 20 63 72
//   │0x00000020│ 6F 73 73 2D 70 6C 61 74 66 6F 72 6D 20 62 61 73
//   │0x00000030│ 68 2D 6C 69 6B 65 20 73 63 72 69 70 74 20 72 75
// ...
```

```ts
// Defined in yavascript/src/api/filesystem/readFile.ts
declare function readFile(
  path: string | Path,
  options: { binary?: boolean }
): string | ArrayBuffer;
```
