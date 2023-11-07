# `Path.OS_ENV_VAR_SEPARATOR` - which delimiter is used for PATH on this OS

`PATH.OS_ENV_VAR_SEPARATOR` is the character used to separate entries within the system's `PATH` environment variable on the current operating system where yavascript is running.

The `PATH` environment variable contains a list of folders wherein command-line programs can be found, separated by either a colon (`:`) or a semicolon (`;`). The value of `OS_ENV_VAR_SEPARATOR` is a semicolon on windows, and a colon on all other operating systems.

The `PATH` environment variable can be accessed by yavascript programs via `env.PATH`. Therefore, one can contain a list of all entries in the `PATH` environment variable via:

```ts
const folders: Array<string> = env.PATH.split(Path.OS_ENV_VAR_SEPARATOR);
```

```ts
// Defined in yavascript/src/api/path
declare const Path.OS_ENV_VAR_SEPARATOR: string;
```
