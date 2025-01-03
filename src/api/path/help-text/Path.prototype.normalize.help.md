# `Path.prototype.normalize` - resolve `.`/`..` segments in a Path

`Path.prototype.normalize` resolves all non-leading `.` and `..` segments. In other words:

- Segments containing `.` are removed
- Segments containing `..` are removed, along with the segment preceding them.

Note that any `.` or `..` segments at the beginning of the path (ie. "leading segments") are not removed.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  normalize(): Path;
  /* ... */
}
```

See also `help(Path.normalize)`.
