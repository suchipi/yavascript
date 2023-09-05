`cat` - Read files from disk

Read the contents of one or more files from disk as one UTF-8 string, print that string to stdout, then return it.

Provides the same functionality as the unix binary of the same name.

```ts
// Defined in yavascript/src/api/commands/cat
declare function cat(...paths: Array<string | Path>): string;
```
