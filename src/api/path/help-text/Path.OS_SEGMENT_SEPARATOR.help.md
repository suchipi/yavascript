# `Path.OS_SEGMENT_SEPARATOR` - which slash is used for paths on this OS

`Path.OS_SEGMENT_SEPARATOR` is the character used to separate path segments on the current operating system where yavascript is running.

Its value is either a forward slash (`/`) or a backslash (`\`). Its value is a backslash on windows, and a forward slash on all other operating systems.

```ts
// Defined in yavascript/src/api/path
declare const Path.OS_SEGMENT_SEPARATOR: string;
```
