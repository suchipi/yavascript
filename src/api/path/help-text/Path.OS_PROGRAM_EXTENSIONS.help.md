# `Path.OS_PROGRAM_EXTENSIONS` - filename extensions programs can have on this OS

`Path.OS_PROGRAM_EXTENSIONS` is a Set of filename extension strings that command-line programs may end with on the current operating system where yavascript is running. Each of these strings contains a leading dot (`.`).

On windows, this value is based on the `PATHEXT` environment variable, which defaults to ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC" on Windows Vista and up. If `PATHEXT` is not defined, that default value is used.

On all other operating systems, this Set is empty.

```ts
// Defined in yavascript/src/api/path
declare const Path.OS_PROGRAM_EXTENSIONS: Set<string>;
```
