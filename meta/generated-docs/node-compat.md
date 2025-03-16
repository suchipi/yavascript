- [global (value)](#global-value)
- [process (object)](#process-object)
  - [process.version (string property)](#processversion-string-property)
  - [process.versions (object property)](#processversions-object-property)
    - [process.versions.node (string property)](#processversionsnode-string-property)
    - [process.versions.yavascript (string property)](#processversionsyavascript-string-property)
    - [process.versions.unicode (string property)](#processversionsunicode-string-property)
  - [process.arch (string property)](#processarch-string-property)
  - [process.env (object property)](#processenv-object-property)
  - [process.argv (property)](#processargv-property)
  - [process.argv0 (string property)](#processargv0-string-property)
  - [process.execPath (string property)](#processexecpath-string-property)
  - [process.exitCode (number property)](#processexitcode-number-property)
  - [process.exit (method)](#processexit-method)

# global (value)

For compatibility with Node.js scripts, the global object is accessible via
the global variable named "global".

```ts
var global: typeof globalThis;
```

# process (object)

A `process` global is provided for rudimentary compatibility with Node.js
scripts. It contains a subset of the properties found on the Node.js
`process` global, which each forward to their corresponding yavascript API.

For instance, `process.env` is a getter that returns [env](/meta/generated-docs/env.md#env-object), and
`process.argv` is a getter that returns [scriptArgs](/meta/generated-docs/libc.md#scriptargs-value).

If you are writing yavascript-specific code, you should use yavascript's APIs
instead of `process`.

```ts
var process: {
  version: string;
  versions: {
    node: string;
    yavascript: string;
    unicode: string;
  };
  arch: string;
  readonly env: {
    [key: string]: string | undefined;
  };
  readonly argv: Array<string>;
  readonly argv0: string;
  readonly execPath: string;
  exitCode: number;
  exit(code?: number | null | undefined): void;
};
```

## process.version (string property)

```ts
version: string;
```

## process.versions (object property)

```ts
versions: {
  node: string;
  yavascript: string;
  unicode: string;
}
```

### process.versions.node (string property)

```ts
node: string;
```

### process.versions.yavascript (string property)

```ts
yavascript: string;
```

### process.versions.unicode (string property)

```ts
unicode: string;
```

## process.arch (string property)

```ts
arch: string;
```

## process.env (object property)

Same as the global [env](/meta/generated-docs/env.md#env-object).

```ts
readonly env: {
  [key: string]: string | undefined;
};
```

## process.argv (property)

Same as the global [scriptArgs](/meta/generated-docs/libc.md#scriptargs-value).

```ts
readonly argv: Array<string>;
```

## process.argv0 (string property)

Same as `scriptArgs[0]`.

```ts
readonly argv0: string;
```

## process.execPath (string property)

Shortcut for `os.realpath(os.execPath())`, using the QuickJS [os](/meta/generated-docs/libc.md#quickjsos-namespace)
module.

```ts
readonly execPath: string;
```

## process.exitCode (number property)

Uses `std.getExitCode()` and `std.setExitCode()` from the QuickJS
[std](/meta/generated-docs/libc.md#quickjsstd-namespace) module.

```ts
exitCode: number;
```

## process.exit (method)

Uses `std.exit()` from the QuickJS [std](/meta/generated-docs/libc.md#quickjsstd-namespace) module.

```ts
exit(code?: number | null | undefined): void;
```
