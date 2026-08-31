---
hide_title: true
---
## extname (function)

Returns the file extension of the file at a given path.

If the file has no extension (eg `Makefile`, etc), then `''` will be
returned.

- `@param` _pathOrFilename_ — The input path
- `@param` _options_ — Options which affect the return value. See [ExtnameOptions](./extname.md#extnameoptions-interface).

```ts
declare function extname(
  pathOrFilename: string | Path,
  options?: ExtnameOptions,
): string;
```

## ExtnameOptions (interface)

Options for [extname](./extname.md#extname-function) and [Path.prototype.extname](./path.md#pathprototypeextname-method).

```ts
declare interface ExtnameOptions {
  full?: boolean;
}
```

### ExtnameOptions.full (boolean property)

Whether to get compound extensions, like `.d.ts` or `.test.js`, instead of
just the final extension (`.ts` or `.js` in this example).

```ts
full?: boolean;
```
