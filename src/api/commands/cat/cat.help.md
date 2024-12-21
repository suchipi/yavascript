# `cat` - Read files from disk

Reads the contents of one or more files from disk as either one UTF-8 string or one ArrayBuffer.

Provides the same functionality as the unix binary of the same name.

> Example: If you have a file called `hi.txt` in the current working directory, and it contains the text "hello", running `cat("hi.txt")` returns `"hello"`.

```ts
// Defined in yavascript/src/api/commands/cat
declare function cat(
  paths: string | Path | Array<string | Path>,
  options?: { binary: true }
): string | ArrayBuffer;
```
