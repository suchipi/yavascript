- [ls (function)](#ls-function)

# ls (function)

Returns the contents of a directory, as absolute paths. `.` and `..` are
omitted.

If `ls()` is called with no directory, the present working directory
(`pwd()`) is used.

```ts
declare function ls(dir?: string | Path): Array<Path>;
```
