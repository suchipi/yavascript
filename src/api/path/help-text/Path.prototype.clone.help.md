# `Path.prototype.clone` - copy a Path object

`Path.prototype.clone` creates a new Path object containing the same segments and separator as the target Path.

Note that although it contains the same segments, the new Path does not use the same Array instance for segments as target Path.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  clone(): Path;
  /* ... */
}
```
