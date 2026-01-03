- [parseScriptArgs (function)](#parsescriptargs-function)
  - [hints](#hints)
  - [argv](#argv)
  - [Return Value](#return-value)
- [ParseScriptArgsResult (interface)](#parsescriptargsresult-interface)
  - [ParseScriptArgsResult.flags (object property)](#parsescriptargsresultflags-object-property)
  - [ParseScriptArgsResult.args (property)](#parsescriptargsresultargs-property)
  - [ParseScriptArgsResult.metadata (object property)](#parsescriptargsresultmetadata-object-property)
    - [ParseScriptArgsResult.metadata.keys (object property)](#parsescriptargsresultmetadatakeys-object-property)
    - [ParseScriptArgsResult.metadata.hints (object property)](#parsescriptargsresultmetadatahints-object-property)
    - [ParseScriptArgsResult.metadata.guesses (object property)](#parsescriptargsresultmetadataguesses-object-property)

# parseScriptArgs (function)

A function which parses command line `--flags` into an object of flags and an
array of positional arguments. This function is opinionated; if it doesn't
meet your needs, you can parse the [scriptArgs](/meta/generated-docs/libc.md#scriptargs-value) global manually.

Flags `--like-this`, `--like_this`, or `--LIKE_THIS` get converted into
property names `likeThis` on the returned flags object.

Flags like this: `-v` get converted into into property names like this: `v`
on the returned flags object.

Anything that appears after `--` is considered a positional argument instead
of a flag. `--` is not present in the returned positional arguments Array.

`parseScriptArgs` accepts two optional parameters: `hints` and `argv`.

## hints

If present, `hints` should be an object whose keys are flag names (in
lowerCamelCase) and whose values indicate what type to treat that flag as.
Valid property values are `String`, `Boolean`, `Number`, and `Path`. `Path`
will resolve relative paths into absolute paths for you. If no hints object
is specified, `parseScriptArgs` will do its best to guess the types.

## argv

The `argv` parameter, if present, should be an array containing the command
line flags you want to parse. If you don't provide one, `scriptArgs.slice(2)`
will be used (we slice 2 in order to skip the yavascript binary and script
name). If you pass in an array here, it should only contain command-line
flags, not the binary being called.

## Return Value

`parseScriptArgs` returns an object with three properties: `flags`, `args`,
and `metadata`.

- `flags` is an object whose keys are lowerCamelCase flag names and whose
  values are strings, booleans, numbers, or `Path`s corresponding to the
  input command-line args.
- `args` is an Array of positional arguments, as found on the command-line.
- `metadata` contains information about what name and type the flags got
  mapped to.

- `@param` _hints_ — An object whose keys are flag names (in lowerCamelCase) and
  whose values indicate what type to treat that flag as. Valid property values
  are `String`, `Boolean`, `Number`, and `Path`. `Path` will resolve relative
  paths into absolute paths for you. If no hints object is specified,
  `parseScriptArgs` will do its best to guess, based on the command-line args.
- `@param` _argv_ — An array containing the command line flags you want to parse.
  If unspecified, `scriptArgs.slice(2)` will be used (we slice 2 in order to
  skip the yavascript binary and script name). If you pass in an array here, it
  should only contain command-line flags, not the binary being called.

- `@returns` A [ParseScriptArgsResult](/meta/generated-docs/parse-script-args.md#parsescriptargsresult-interface), which is an object with three
  properties: `flags`, `args`, and `metadata`. `flags` is an object whose keys
  are camelCase flag names and whose values are strings, booleans, numbers, or
  `Path`s corresponding to the input command-line args. `args` is an Array of
  positional arguments, as found on the command-line. `metadata` contains
  information about what name and type the flags got mapped to.

```ts
declare function parseScriptArgs(
  hints?: {
    [key: string]: typeof String | typeof Boolean | typeof Number | typeof Path;
  },
  args?: Array<string>,
): ParseScriptArgsResult;
```

# ParseScriptArgsResult (interface)

The return type of [parseScriptArgs](/meta/generated-docs/parse-script-args.md#parsescriptargs-function).

The `flags` property contains the values for any command-line `--flags`, with
key names converted to `lowerCamelCase`.

The `args` property contains an array of those command-line arguments which
weren't associated with a flag.

The `metadata` property contains information about the parsing process,
including what case changes were applied to the keys, which hints were used,
and which properties had their type guessed because no corresponding hint was
available.

```ts
declare interface ParseScriptArgsResult {
  flags: {
    [key: string]: any;
  };
  args: Array<string>;
  metadata: {
    keys: {
      [key: string]: string | undefined;
    };
    hints: {
      [key: string]: "path" | "number" | "boolean" | "string" | undefined;
    };
    guesses: {
      [key: string]: "number" | "boolean" | "string" | undefined;
    };
  };
}
```

## ParseScriptArgsResult.flags (object property)

The values for any command-line `--flags`, with key names converted to `lowerCamelCase`.

```ts
flags: {
  [key: string]: any;
};
```

## ParseScriptArgsResult.args (property)

An array of those command-line arguments which weren't associated with a flag.

```ts
args: Array<string>;
```

## ParseScriptArgsResult.metadata (object property)

Information about the parsing process, including what case changes were
applied to the keys, which hints were used, and which properties had their
type guessed because no corresponding hint was available.

```ts
metadata: {
  keys: {
    [key: string]: string | undefined;
  };
  hints: {
    [key: string]: "path" | "number" | "boolean" | "string" | undefined;
  };
  guesses: {
    [key: string]: "number" | "boolean" | "string" | undefined;
  };
};
```

### ParseScriptArgsResult.metadata.keys (object property)

An object whose keys are the verbatim flags from the command-line, and
whose values are the lowerCamelCase names they were converted to in the
`flags` property of the [ParseScriptArgsResult](/meta/generated-docs/parse-script-args.md#parsescriptargsresult-interface).

```ts
keys: {
  [key: string]: string | undefined;
};
```

### ParseScriptArgsResult.metadata.hints (object property)

An object whose keys are the lowerCamelCase flag names, and whose values
are strings indicating the hint values that were specified for those
flags.

```ts
hints: {
  [key: string]: "path" | "number" | "boolean" | "string" | undefined;
};
```

### ParseScriptArgsResult.metadata.guesses (object property)

An object indicating which flags we inferred the type of, because no
corresponding hint was present.

The keys are the lowerCamelCase flag names, and the values are strings
indicating what type we guessed for that flag.

If you're seeing incorrect inference, consider passing a `hints` argument
to [parseScriptArgs](/meta/generated-docs/parse-script-args.md#parsescriptargs-function).

```ts
guesses: {
  [key: string]: "number" | "boolean" | "string" | undefined;
};
```
