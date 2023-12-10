# `Path.from` - create Path from segments and separator

`Path.from` can be used to construct a Path containing the user-provided segments and separator. In most cases, you won't need to do this, and can use `new Path(...)` instead.

If unspecified, the `separator` parameter defaults to `Path.OS_SEGMENT_SEPARATOR`.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  static from(segments: Array<string>, separator?: string): Path;
  /* ... */
}
```
