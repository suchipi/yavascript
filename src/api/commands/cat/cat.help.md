# `cat` - Read files from disk

Reads the contents of one or more files from disk as one UTF-8 string.

Provides the same functionality as the unix binary of the same name.

```ts
// Defined in yavascript/src/api/commands/cat
declare function cat(...paths: Array<string | Path>): string;
```
