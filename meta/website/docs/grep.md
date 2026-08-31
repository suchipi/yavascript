---
hide_title: true
---
## grepString (function)

Splits the string passed into it on `\n` and then returns the lines matching
the specified pattern, as an array of strings or detail objects.

- `@param` _str_ — The string to search through.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepFile](./grep.md#grepfile-function), [grepArray](./grep.md#greparray-function), [String.prototype.grep](./grep.md#stringgrep-function-property),
and [Array.prototype.grep](./grep.md#arraygrep-function-property).

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

### grepString(...) (call signature)

```ts
(str: string, pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail>;
```

### grepString(...) (call signature)

```ts
(str: string, pattern: string | RegExp, options?: GrepOptions): Array<string>;
```

## grepArray (function)

Returns those Array items matching the specified pattern, as either an
Array of items or an Array of detail objects.

- `@param` _targetArray_ — The Array of strings to search through. Non-strings will be coerced to string during matching.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepString](./grep.md#grepstring-function), [grepFile](./grep.md#grepfile-function), [String.prototype.grep](./grep.md#stringgrep-function-property),
and [Array.prototype.grep](./grep.md#arraygrep-function-property).

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

### grepArray(...) (call signature)

```ts
<T>(targetArray: Array<T>, pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail<T>>;
```

### grepArray(...) (call signature)

```ts
<T>(targetArray: Array<T>, pattern: string | RegExp, options?: GrepOptions): Array<T>;
```

## grepFile (function)

Reads the file content at `path`, splits it on `\n`, and then returns the
lines matching the specified pattern, as an array of strings or detail
objects.

- `@param` _str_ — The string to search through.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepArray](./grep.md#greparray-function), [grepString](./grep.md#grepstring-function),
[String.prototype.grep](./grep.md#stringgrep-function-property), and [Array.prototype.grep](./grep.md#arraygrep-function-property).

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

### grepFile(...) (call signature)

```ts
(path: string | Path, pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail>;
```

### grepFile(...) (call signature)

```ts
(path: string | Path, pattern: string | RegExp, options?: GrepOptions): Array<string>;
```

## String (interface)

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

### String.grep (function property)

Splits the target string on `\n` and then returns the lines matching the
specified pattern, as an array of strings or detail objects.

- `@param` _str_ — The string to search through.
- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepString](./grep.md#grepstring-function), [grepArray](./grep.md#greparray-function), [grepFile](./grep.md#grepfile-function), and
[Array.prototype.grep](./grep.md#arraygrep-function-property).

```ts
grep: {
  (pattern: string | RegExp, options: GrepOptions & {
    details: true;
  }): Array<GrepMatchDetail>;
  (pattern: string | RegExp, options?: GrepOptions): Array<string>;
};
```

#### String.grep(...) (call signature)

```ts
(pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail>;
```

#### String.grep(...) (call signature)

```ts
(pattern: string | RegExp, options?: GrepOptions): Array<string>;
```

## Array (interface)

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

### Array.grep (function property)

Returns those Array items matching the specified pattern, as either an
Array of items or an Array of detail objects.

- `@param` _pattern_ — The pattern to find. Can be a string or a RegExp.
- `@param` _options_ — Options which control matching behavior.

See also [grepString](./grep.md#grepstring-function), [grepArray](./grep.md#greparray-function), [grepFile](./grep.md#grepfile-function), and
[String.prototype.grep](./grep.md#stringgrep-function-property).

```ts
grep: {
  (pattern: string | RegExp, options: GrepOptions & {
    details: true;
  }): Array<GrepMatchDetail<T>>;
  (pattern: string | RegExp, options?: GrepOptions): Array<T>;
};
```

#### Array.grep(...) (call signature)

```ts
(pattern: string | RegExp, options: GrepOptions & {
  details: true;
}): Array<GrepMatchDetail<T>>;
```

#### Array.grep(...) (call signature)

```ts
(pattern: string | RegExp, options?: GrepOptions): Array<T>;
```

## GrepOptions (interface)

```ts
declare interface GrepOptions {
  inverse?: boolean;
  details?: boolean;
}
```

### GrepOptions.inverse (boolean property)

When `inverse` is true, the grep function returns those lines which DON'T
match the pattern, instead of those which do. Defaults to `false`.

```ts
inverse?: boolean;
```

### GrepOptions.details (boolean property)

When `details` is true, the grep function returns an array of
[GrepMatchDetail](./grep.md#grepmatchdetail-interface) objects instead of an array of strings. Defaults to
`false`.

```ts
details?: boolean;
```

## GrepMatchDetail (interface)

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

### GrepMatchDetail.lineNumber (number property)

```ts
lineNumber: number;
```

### GrepMatchDetail.lineContent (ItemType property)

```ts
lineContent: ItemType;
```

### GrepMatchDetail.matches (RegExpMatchArray property)

```ts
matches: RegExpMatchArray;
```

### GrepMatchDetail.index (number property)

Same as lineNumber - 1.

```ts
index: number;
```

### GrepMatchDetail.content (ItemType property)

Alias for lineContent.

```ts
content: ItemType;
```
