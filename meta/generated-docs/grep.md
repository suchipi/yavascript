- [grepString (function)](#grepstring-function)
  - [grepString(...) (call signature)](#grepstring-call-signature)
  - [grepString(...) (call signature)](#grepstring-call-signature-1)
- [grepArray (function)](#greparray-function)
  - [grepArray(...) (call signature)](#greparray-call-signature)
  - [grepArray(...) (call signature)](#greparray-call-signature-1)
- [grepFile (function)](#grepfile-function)
  - [grepFile(...) (call signature)](#grepfile-call-signature)
  - [grepFile(...) (call signature)](#grepfile-call-signature-1)
- [String (interface)](#string-interface)
  - [String.grep (function property)](#stringgrep-function-property)
    - [String.grep(...) (call signature)](#stringgrep-call-signature)
    - [String.grep(...) (call signature)](#stringgrep-call-signature-1)
- [Array (interface)](#array-interface)
  - [Array.grep (function property)](#arraygrep-function-property)
    - [Array.grep(...) (call signature)](#arraygrep-call-signature)
    - [Array.grep(...) (call signature)](#arraygrep-call-signature-1)
- [GrepOptions (interface)](#grepoptions-interface)
  - [GrepOptions.inverse (boolean property)](#grepoptionsinverse-boolean-property)
  - [GrepOptions.details (boolean property)](#grepoptionsdetails-boolean-property)
- [GrepMatchDetail (interface)](#grepmatchdetail-interface)
  - [GrepMatchDetail.lineNumber (number property)](#grepmatchdetaillinenumber-number-property)
  - [GrepMatchDetail.lineContent (ItemType property)](#grepmatchdetaillinecontent-itemtype-property)
  - [GrepMatchDetail.matches (RegExpMatchArray property)](#grepmatchdetailmatches-regexpmatcharray-property)
  - [GrepMatchDetail.index (number property)](#grepmatchdetailindex-number-property)
  - [GrepMatchDetail.content (ItemType property)](#grepmatchdetailcontent-itemtype-property)

# grepString (function)

Splits the string passed into it on `\n` and then returns the lines matching
the specified pattern, as an array of strings or detail objects.

- `@param` _str_ — The string to search through.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepFile](/meta/generated-docs/grep.md#grepfile-function), [grepArray](/meta/generated-docs/grep.md#greparray-function), [String.prototype.grep](/meta/generated-docs/grep.md#stringgrep-function-property),
and [Array.prototype.grep](/meta/generated-docs/grep.md#arraygrep-function-property).

```ts
const grepString: {
  (
    str: string,
    pattern: string | RegExp,
    options: GrepOptions & {
      details: true;
    },
  ): Array<GrepMatchDetail>;
  (str: string, pattern: string | RegExp, options?: GrepOptions): Array<string>;
};
```

## grepString(...) (call signature)

```ts
(str: string, pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail>;
```

## grepString(...) (call signature)

```ts
(str: string, pattern: string | RegExp, options?: GrepOptions): Array<string>;
```

# grepArray (function)

Returns those Array items matching the specified pattern, as either an
Array of items or an Array of detail objects.

- `@param` _targetArray_ — The Array of strings to search through. Non-strings will be coerced to string during matching.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepString](/meta/generated-docs/grep.md#grepstring-function), [grepFile](/meta/generated-docs/grep.md#grepfile-function), [String.prototype.grep](/meta/generated-docs/grep.md#stringgrep-function-property),
and [Array.prototype.grep](/meta/generated-docs/grep.md#arraygrep-function-property).

```ts
const grepArray: {
  <T>(
    targetArray: Array<T>,
    pattern: string | RegExp,
    options: GrepOptions & {
      details: true;
    },
  ): Array<GrepMatchDetail<T>>;
  <T>(
    targetArray: Array<T>,
    pattern: string | RegExp,
    options?: GrepOptions,
  ): Array<T>;
};
```

## grepArray(...) (call signature)

```ts
<T>(targetArray: Array<T>, pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail<T>>;
```

## grepArray(...) (call signature)

```ts
<T>(targetArray: Array<T>, pattern: string | RegExp, options?: GrepOptions): Array<T>;
```

# grepFile (function)

Reads the file content at `path`, splits it on `\n`, and then returns the
lines matching the specified pattern, as an array of strings or detail
objects.

- `@param` _str_ — The string to search through.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepArray](/meta/generated-docs/grep.md#greparray-function), [grepString](/meta/generated-docs/grep.md#grepstring-function),
[String.prototype.grep](/meta/generated-docs/grep.md#stringgrep-function-property), and [Array.prototype.grep](/meta/generated-docs/grep.md#arraygrep-function-property).

```ts
const grepFile: {
  (
    path: string | Path,
    pattern: string | RegExp,
    options: GrepOptions & {
      details: true;
    },
  ): Array<GrepMatchDetail>;
  (
    path: string | Path,
    pattern: string | RegExp,
    options?: GrepOptions,
  ): Array<string>;
};
```

## grepFile(...) (call signature)

```ts
(path: string | Path, pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail>;
```

## grepFile(...) (call signature)

```ts
(path: string | Path, pattern: string | RegExp, options?: GrepOptions): Array<string>;
```

# String (interface)

```ts
interface String {
  grep: {
    (
      pattern: string | RegExp,
      options: GrepOptions & {
        details: true;
      },
    ): Array<GrepMatchDetail>;
    (pattern: string | RegExp, options?: GrepOptions): Array<string>;
  };
}
```

## String.grep (function property)

Splits the target string on `\n` and then returns the lines matching the
specified pattern, as an array of strings or detail objects.

- `@param` _str_ — The string to search through.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepString](/meta/generated-docs/grep.md#grepstring-function), [grepArray](/meta/generated-docs/grep.md#greparray-function), [grepFile](/meta/generated-docs/grep.md#grepfile-function), and
[Array.prototype.grep](/meta/generated-docs/grep.md#arraygrep-function-property).

```ts
grep: {
  (pattern: string | RegExp, options: GrepOptions & {
    details: true;
  }): Array<GrepMatchDetail>;
  (pattern: string | RegExp, options?: GrepOptions): Array<string>;
};
```

### String.grep(...) (call signature)

```ts
(pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail>;
```

### String.grep(...) (call signature)

```ts
(pattern: string | RegExp, options?: GrepOptions): Array<string>;
```

# Array (interface)

```ts
interface Array<T> {
  grep: {
    (
      pattern: string | RegExp,
      options: GrepOptions & {
        details: true;
      },
    ): Array<GrepMatchDetail<T>>;
    (pattern: string | RegExp, options?: GrepOptions): Array<T>;
  };
}
```

## Array.grep (function property)

Returns those Array items matching the specified pattern, as either an
Array of items or an Array of detail objects.

- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepString](/meta/generated-docs/grep.md#grepstring-function), [grepArray](/meta/generated-docs/grep.md#greparray-function), [grepFile](/meta/generated-docs/grep.md#grepfile-function), and
[String.prototype.grep](/meta/generated-docs/grep.md#stringgrep-function-property).

```ts
grep: {
  (pattern: string | RegExp, options: GrepOptions & {
    details: true;
  }): Array<GrepMatchDetail<T>>;
  (pattern: string | RegExp, options?: GrepOptions): Array<T>;
};
```

### Array.grep(...) (call signature)

```ts
(pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail<T>>;
```

### Array.grep(...) (call signature)

```ts
(pattern: string | RegExp, options?: GrepOptions): Array<T>;
```

# GrepOptions (interface)

```ts
declare interface GrepOptions {
  inverse?: boolean;
  details?: boolean;
}
```

## GrepOptions.inverse (boolean property)

When `inverse` is true, the grep function returns those lines which DON'T
match the pattern, instead of those which do. Defaults to `false`.

```ts
inverse?: boolean;
```

## GrepOptions.details (boolean property)

When `details` is true, the grep function returns an array of
[GrepMatchDetail](/meta/generated-docs/grep.md#grepmatchdetail-interface) objects instead of an array of strings. Defaults to
`false`.

```ts
details?: boolean;
```

# GrepMatchDetail (interface)

When `grepString`, `grepArray`, `grepFile`, or `String.prototype.grep` are
called with the `{ details: true }` option set, an Array of `GrepMatchDetail`
objects is returned.

```ts
declare interface GrepMatchDetail<ItemType = string> {
  lineNumber: number;
  lineContent: ItemType;
  matches: RegExpMatchArray;
  index: number;
  content: ItemType;
}
```

## GrepMatchDetail.lineNumber (number property)

```ts
lineNumber: number;
```

## GrepMatchDetail.lineContent (ItemType property)

```ts
lineContent: ItemType;
```

## GrepMatchDetail.matches (RegExpMatchArray property)

```ts
matches: RegExpMatchArray;
```

## GrepMatchDetail.index (number property)

Same as lineNumber - 1.

```ts
index: number;
```

## GrepMatchDetail.content (ItemType property)

Alias for lineContent.

```ts
content: ItemType;
```
