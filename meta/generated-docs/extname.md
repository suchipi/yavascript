- [extname (function)](#extname-function)
- [ExtnameOptions (interface)](#extnameoptions-interface)
  - [ExtnameOptions.full (boolean property)](#extnameoptionsfull-boolean-property)

# extname (function)

Returns the file extension of the file at a given path.

If the file has no extension (eg `Makefile`, etc), then `''` will be
returned.

- `@param` _pathOrFilename_ — The input path
- `@param` _options_ — Options which affect the return value. See [ExtnameOptions](/meta/generated-docs/extname.md#extnameoptions-interface).

**Example**

```ts
const extension = extname("src/index.test.ts");
console.log(extension); // .ts
```

```ts
declare function extname(
  pathOrFilename: string | Path,
  options?: ExtnameOptions,
): string;
```

# ExtnameOptions (interface)

Options for [extname](/meta/generated-docs/extname.md#extname-function) and [Path.prototype.extname](/meta/generated-docs/path.md#pathprototypeextname-method).

**Example**

```ts
const options: ExtnameOptions = { full: true };
console.log(extname("types.d.ts", options)); // .d.ts
```

```ts
declare interface ExtnameOptions {
  full?: boolean;
}
```

## ExtnameOptions.full (boolean property)

Whether to get compound extensions, like `.d.ts` or `.test.js`, instead of
just the final extension (`.ts` or `.js` in this example).

**Example**

```ts
console.log(extname("types.d.ts", { full: true })); // .d.ts
console.log(extname("types.d.ts", { full: false })); // .ts
```

```ts
full?: boolean;
```
