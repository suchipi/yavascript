- [global (value)](#global-value)
- [process (object)](#process-object)
  - [process.version (string property)](#processversion-string-property)
  - [process.versions (object property)](#processversions-object-property)
    - [process.versions.node (string property)](#processversionsnode-string-property)
    - [process.versions.yavascript (string property)](#processversionsyavascript-string-property)
    - [process.versions.unicode (string property)](#processversionsunicode-string-property)
  - [process.arch (string property)](#processarch-string-property)
  - [process.env (readonly object property)](#processenv-readonly-object-property)
  - [process.argv (readonly property)](#processargv-readonly-property)
  - [process.argv0 (readonly string property)](#processargv0-readonly-string-property)
  - [process.execPath (readonly string property)](#processexecpath-readonly-string-property)
  - [process.exitCode (number property)](#processexitcode-number-property)
  - [process.exit (method)](#processexit-method)

# global (value)

For compatibility with Node.js scripts, the global object is accessible via
the global variable named "global".

**Example**

```ts
console.log(global === globalThis);
```

```ts
var global: typeof globalThis;
```

# process (object)

A `process` global is provided for rudimentary compatibility with Node.js
scripts. It contains a subset of the properties found on the Node.js
`process` global, which each forward to their corresponding yavascript API.

For instance, `process.env` is a getter that returns [env](/meta/generated-docs/env.md#env-object), and
`process.argv` is a getter that returns [scriptArgs](/meta/generated-docs/cmdline.md#scriptargs-value).

If you are writing yavascript-specific code, you should use yavascript's APIs
instead of `process`.

**Example**

```ts
console.log(process.version, process.arch);
console.log(process.argv);
```

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

## process.env (readonly object property)

Same as the global [env](/meta/generated-docs/env.md#env-object).

**Example**

```ts
console.log(process.env.HOME);
```

```ts
readonly env: {
  [key: string]: string | undefined;
};
```

## process.argv (readonly property)

Same as the global [scriptArgs](/meta/generated-docs/cmdline.md#scriptargs-value).

**Example**

```ts
const args = process.argv.slice(2);
console.log(args);
```

```ts
readonly argv: Array<string>;
```

## process.argv0 (readonly string property)

Same as `scriptArgs[0]`.

**Example**

```ts
console.log(process.argv0);
```

```ts
readonly argv0: string;
```

## process.execPath (readonly string property)

Shortcut for `os.realpath(os.execPath())`, using the QuickJS [os](/meta/generated-docs/os.md#quickjsos-namespace)
module.

**Example**

```ts
exec([process.execPath, "--version"]);
```

```ts
readonly execPath: string;
```

## process.exitCode (number property)

Uses `std.getExitCode()` and `std.setExitCode()` from the QuickJS
[std](/meta/generated-docs/std.md#quickjsstd-namespace) module.

**Example**

```ts
process.exitCode = 1;
```

```ts
exitCode: number;
```

## process.exit (method)

Uses `std.exit()` from the QuickJS [std](/meta/generated-docs/std.md#quickjsstd-namespace) module.

**Example**

```ts
if (process.argv.length < 3) {
  console.error("Please specify an input file");
  process.exit(1);
}
```

```ts
exit(code?: number | null | undefined): void;
```
