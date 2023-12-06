# `Path.detectSeparator` - identify which slash separates path segments

`Path.detectSeparator` searches the provided path string or strings for a path separator character (either forward slash or backslash), and returns the one it finds. If neither is found, it returns the `fallback` arg, which defaults to the current OS's path segment separator (`Path.OS_SEGMENT_SEPARATOR`).

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  static detectSeparator(
    input: Array<string> | string,
    fallback?: string | null
  ): string | null;
  /* ... */
}
```
