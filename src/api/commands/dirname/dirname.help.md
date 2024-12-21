# `dirname` - Get a path's enclosing folder path

Removes the final component from a path string.

Provides the same functionality as the unix binary of the same name.

> Example: `dirname("/home/suchipi/something")` returns `"/home/suchipi/something"`, everything except the last part.

```ts
// Defined in yavascript/src/api/commands/dirname
declare function dirname(path: string | Path): Path;
```

See also `help(basename)` and `help(Path)`.
