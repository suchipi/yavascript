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

## `string-dedent+3.0.2`

`parseHex` bailed on `end >= str.length`, an off-by-one: a `\xHH` escape whose last digit is the final character of the raw string is in range, but was rejected, which is what happens when the escape sits directly before an interpolation. Covered by `String.dedent handles a hex escape directly before an interpolation`. 3.0.2 is the latest release and there is no upstream fix.
