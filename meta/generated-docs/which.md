- [which (function)](#which-function)
- [WhichOptions (type)](#whichoptions-type)
  - [WhichOptions.searchPaths (property)](#whichoptionssearchpaths-property)
  - [WhichOptions.suffixes (property)](#whichoptionssuffixes-property)
  - [WhichOptions.logging (object property)](#whichoptionslogging-object-property)
    - [WhichOptions.logging.trace (function property)](#whichoptionsloggingtrace-function-property)

# which (function)

Searches the system for the path to a program named `binaryName`.

If the program can't be found, `null` is returned.

- `@param` _binaryName_ — The program to search for
- `@param` _options_ — Options which affect how the search is performed
- `@param` _options.searchPaths_ — A list of folders where programs may be found. Defaults to `env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || []`.
- `@param` _options.suffixes_ — A list of filename extension suffixes to include in the search, ie [".exe"]. Defaults to `Path.OS_PROGRAM_EXTENSIONS`.
- `@param` _options.trace_ — A logging function that will be called at various times during the execution of `which`. Defaults to [logger.trace](/meta/generated-docs/logger.md#loggertrace-function-property).

```ts
declare function which(binaryName: string, options?: WhichOptions): Path | null;
```

# WhichOptions (type)

```ts
declare type WhichOptions = {
  searchPaths?: Array<Path | string>;
  suffixes?: Array<string>;
  logging?: {
    trace?: (...args: Array<any>) => void;
  };
};
```

## WhichOptions.searchPaths (property)

A list of folders where programs may be found. Defaults to
`env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || []`.

```ts
searchPaths?: Array<Path | string>;
```

## WhichOptions.suffixes (property)

A list of filename extension suffixes to include in the search, ie
`[".exe"]`. Defaults to [Path.OS_PROGRAM_EXTENSIONS](/meta/generated-docs/path.md#pathos_program_extensions-static-property).

```ts
suffixes?: Array<string>;
```

## WhichOptions.logging (object property)

Options which control logging.

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
};
```

### WhichOptions.logging.trace (function property)

If provided, this logging function will be called multiple times as
`which` runs, to help you understand what's going on and/or troubleshoot
things. In most cases, it makes sense to use a function from `console`
here, like so:

```js
which("bash", {
  logging: { trace: console.log },
});
```

Defaults to the current value of [logger.trace](/meta/generated-docs/logger.md#loggertrace-function-property). `logger.trace`
defaults to a no-op function.

```ts
trace?: (...args: Array<any>) => void;
```
