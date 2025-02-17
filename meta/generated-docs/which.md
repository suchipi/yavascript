# which (function)

Searches the system for the path to a program named `binaryName`.

If the program can't be found, `null` is returned.

- `@param` _binaryName_ — The program to search for
- `@param` _options_ — Options which affect how the search is performed
- `@param` _options.searchPaths_ — A list of folders where programs may be found. Defaults to `env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || []`.
- `@param` _options.suffixes_ — A list of filename extension suffixes to include in the search, ie [".exe"]. Defaults to `Path.OS_PROGRAM_EXTENSIONS`.
- `@param` _options.trace_ — A logging function that will be called at various times during the execution of `which`. Defaults to [logger.trace](#).

```ts
declare function which(
  binaryName: string,
  options?: {
    searchPaths?: Array<Path | string>;
    suffixes?: Array<string>;
    logging?: {
      trace?: (...args: Array<any>) => void;
    };
  },
): Path | null;
```
