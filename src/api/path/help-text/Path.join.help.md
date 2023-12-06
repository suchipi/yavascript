# `Path.join` - join together one or more paths

`Path.join` combines paths or path segments together by concatenating their segments, left-to-right. A new `Path` instance is returned.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  static join(...inputs: Array<string | Path | Array<string | Path>>): Path;
  /* ... */
}
```
