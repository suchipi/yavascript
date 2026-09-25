# Dependency patches

Applied by [patch-package](https://npmjs.com/package/patch-package) from the root `postinstall` script. Because they don't live in the default `patches/`, every patch-package invocation needs `--patch-dir meta/patches`, including when creating one:

```
npx patch-package <package-name> --patch-dir meta/patches
```

Each patch fixes an upstream bug that yavascript has a regression test for, so if one stops applying after a dependency upgrade, check whether the fix landed upstream before reimplementing it.

## `@iarna/toml+2.2.5`

Two fixes in `lib/toml-parser.js`:

- `parseOnlyTimeFractionMaybe` finished with `this.return`, which steps past the current character. For a local time with no fractional part the current character is already the delimiter, so the newline after it got swallowed and the following line failed to parse. The fraction branch beside it uses `returnNow`, which re-runs the state machine on that character, and that is what this branch now does too. Covered by `TOML.parse - a local time followed by another line`.
- `BoxedBigInt` boxed an out-of-range integer with `BigInt.asIntN(64, value)`, which silently wraps: `9223372036854775808` came back negative with no way to tell afterwards. It now throws a `TomlError`. Covered by `TOML.parse - an integer too big for int64 is an error`.

Not reported upstream: `@iarna/toml` was last published in 2019 and its repository is archived.

## `clef-parse+0.8.0`

- `convertToCamelCase` split on an ASCII-only word boundary and dropped any part containing no ASCII alphanumerics, so `--hello` survived but `--héllo` became `hLlo`. Now splits on non-letter/non-number using Unicode property escapes.
- Anything starting with `-` was read as a flag, so a lone `-` became a flag named `""` and `-3` a flag named `"3"`. `isFlag` now excludes both, making them positional args.
- `bestGuess` treated a value starting with `-` as an absent value, so `--count=-5` parsed as `{count: true}`. A value after `=` is now always taken literally.

Covered by the last three tests in `meta/tests/src/parse-script-args.test.ts`. clef-parse is Lily's own package, so these should go upstream rather than living here.

## `nice-path+3.2.2`

All five fixes are in `dist/index.js`, and each one replaced an override that used to live on yavascript's `Path` subclass. Covered by `meta/tests/src/path.test.ts`.

- `toString` rendered a path with no segments as `/`. Nothing joined to nothing is the current directory, so it returns `.`.
- The constructor let an empty input contribute a root segment, which made `new Path("", "etc")` absolute. Empty top-level inputs are dropped.
- `relativeTo` compared `ownSegments[0] === dirSegments[0]` with no length guard, so once both ran out it compared `undefined` to `undefined` forever and looped.
- `replaceAll` re-scanned from `matchingIndex + replacement.segments.length` after calling `replace`, which rescanned a replacement and, for a replacement shorter than what it replaced, could leave the scan position where it started. It now walks the segments once.
- `normalize` treated `..` as "pop unless what's collected so far is only dots", which sent `..` above an absolute root and collapsed a fully-cancelled relative path to nothing. `..` at the root now stays at the root, a fully-cancelled relative path becomes `.`, and a leading `.` is preserved.

nice-path is Lily's own package, so these should go upstream.

## `pheno+1.13.1`

- `dist/*/coerce/coerce.js` built object shapes with `Object.entries`, which drops symbol keys, so a shape keyed by a symbol checked nothing at all. Four call sites now use a `Reflect.ownKeys` helper. Covered by `is - symbol-keyed properties in an object shape are checked`.
- `dist/*/type-constructors.js`: `arrayOf` and `tuple` validated with `Array.prototype.every`, which skips holes, so `[1, , 3]` passed an `arrayOf(number)` check. Covered by `is - array holes fail element checks`.
- `dist/*/type-constructors.js`: `mappingObjectOf` (exported as `record`) checked keys as-is, and own keys are always strings or symbols, so `record(Number, String)` never matched anything. A numeric key is now offered to the key validator as a number too. Covered by `types.record - a Number key type matches numeric keys`.

Both the `cjs` and `esm` builds are patched, since which one gets bundled depends on the resolver.

Note what is deliberately *not* patched: pheno decides whether a function is a class by looking for `class ` in its source text, which never matches under yavascript because compiling to bytecode drops function bodies. That is a known and accepted limitation. `Path` works around it for itself with a `PHENO_COERCE_OVERRIDE` in `src/layer1/api/path/path.ts`.

## `string-dedent+3.0.2`

`parseHex` bailed on `end >= str.length`, an off-by-one: a `\xHH` escape whose last digit is the final character of the raw string is in range, but was rejected, which is what happens when the escape sits directly before an interpolation. Covered by `String.dedent handles a hex escape directly before an interpolation`. 3.0.2 is the latest release and there is no upstream fix.
