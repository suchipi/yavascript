# `which` - Search the filesystem for a program with the given name

Searches the system for the path to a program named `binaryName`.

If the program can't be found, `null` is returned.

## Options:

- `searchPaths`
  - A list of folders where programs may be found. Defaults to `env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR)`.
- `suffixes`
  - A list of filename extension suffixes to include in the search, ie `[".exe"]`. Defaults to `Path.OS_PROGRAM_EXTENSIONS`.
- `trace`
  - A logging function that will be called at various times during the execution of `which`. Useful for debugging. Defaults to `logger.trace`.

```ts
// Defined in yavascript/src/api/commands/which
declare function which(
  binaryName: string,
  options?: {
    searchPaths?: Array<Path | string>;
    suffixes?: Array<string>;
    trace?: (...args: Array<any>) => void;
  }
): Path | null;
```
