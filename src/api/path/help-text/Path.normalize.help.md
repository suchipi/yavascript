# `Path.normalize` - resolve `.`/`..` segments in a Path

`Path.normalize` concatenates the input path(s) and then resolves all non-leading `.` and `..` segments. In other words:

- Segments containing `.` are removed
- Segments containing `..` are removed, along with the segment preceding them.

Note that any `.` or `..` segments at the beginning of the path (ie. "leading segments") are not removed.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): Path;
  /* ... */
}
```

See also `help(Path.prototype.normalize)`.
