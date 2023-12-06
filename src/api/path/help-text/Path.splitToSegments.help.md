# `Path.splitToSegments` - split path into array of segments

`Path.splitToSegments` can be used to convert a string (or array of strings) into an array of path segment strings (the parts between the slashes).

For example:

```ts
const input = ["hi", "there/every/one", "yeah\\yup"];
const result = Path.splitToSegments(input);
// result is ["hi", "there", "every", "one", "yeah", "yup"]
```

---

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  static splitToSegments(inputParts: Array<string> | string): Array<string>;
  /* ... */
}
```
