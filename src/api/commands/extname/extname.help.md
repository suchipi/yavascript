# `extname` - Get file extension

Returns the file extension of the file at a given path.

If the file has no extension (eg `Makefile`, etc), then `''` will be returned.

Pass `{ full: true }` to get compound extensions, eg `.d.ts` or `.test.js` instead of just `.ts`/`.js`.

```ts
// Defined in yavascript/src/api/commands/extname
declare function extname(
  pathOrFilename: string | Path,
  options?: { full?: boolean }
): string;
```

See also `help(basename)`.
