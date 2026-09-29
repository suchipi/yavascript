# API audit: console, inspect, strings, grep, logger, RegExp.escape, String.dedent, Promise.map

Binary: `./dist/yavascript` (`-v` reports `git-d8cc554c0810`). All commands run from the repo root with `</dev/null`. Scratch scripts are in `.tmp/gap-update/console/`. The repros assume `sh`/`bash` redirection semantics; under zsh, run stream-separation repros through `sh -c`.

## Findings

### 1. bug - objects passed to `logger.info` / `logger.warn`, and uncaught errors, are colorized based on whether stdout is a TTY, not stderr

```
script -q /dev/null sh -c "./dist/yavascript -e 'logger.info(\"msg\", {a:1})' 2>.tmp/gap-update/console/logger-to-file.txt" </dev/null >/dev/null
cat -v .tmp/gap-update/console/logger-to-file.txt
```
- Expected: a plain `msg {\n  a: 1\n}` in the file (stderr is a file)
- Actual: `msg ^[[38;5;237m{^[[0m ...`. The `dim` wrapper is skipped, but the inspected object still carries escapes.

The opposite case fails too: with stdout redirected to a file and stderr on a terminal, the object prints uncolored inside the dim text. Uncaught errors behave the same way: `throw {a: 1}` with only stderr redirected writes `Non-error value was thrown: ^[[38;5;237m{^[[0m ...` to the file, and so does the extra-props block of a thrown `Error`.

Source: `inspectManyToParts` (`src/layer1/api/shared/make-inspect-log.ts:18`) and `src/layer1/print-error.ts:40,46` call `inspectOptions.forPrint()` without a file, so `src/layer1/inspect-options.ts:10` falls back to `std.out`. `console.error`/`console.warn` pass their own stream (`make-inspect-log.ts:40`).

### 2. bug - when inspect fails, `console.log` writes the bare inner error message to stderr with no context

```
./dist/yavascript -e 'const r = Proxy.revocable({}, {}); r.revoke(); console.log("v:", r.proxy); console.log("after")'
```
- Expected: a stderr message that says what failed, or none
- Actual: stdout gets `v: <unprintable value>` and `after`, and the exit code is 0, but stderr gets a bare `revoked proxy` line that doesn't say where it came from.

An object whose `inspect.custom` throws does the same: stderr gets a bare `boom in custom`, and stdout gets `v: [object Object]` (or `v: <unprintable value>` for a null-prototype object). `logger.info` behaves the same way.

Source: `src/layer1/api/shared/make-inspect-log.ts:55` (and the copy at `:21`) writes only `err.message`.

### 3. gap - most standard `console` methods are missing, and calling one gives an unhelpful error

`console` only has `log, info, warn, error, clear`. `debug`, `trace`, `dir`, `dirxml`, `table`, `group`, `groupEnd`, `time`, `timeEnd`, `timeLog`, `count`, `countReset`, and `assert` are all `undefined`.

```
./dist/yavascript -e "console.debug('x')"
```
- Actual: `TypeError: not a function at <internal>/quickjs.c:18334:0`, exit 1. The message doesn't name the method.

Third-party code loaded through `npm:`/`http:` imports often calls `console.debug`/`console.trace`/`console.time`, and it will crash. For TypeScript users who also pull in `lib.dom` or `@types/node`, these calls typecheck and then fail at runtime. Source: `src/layer1/api/console/console.ts:12-18`.

### 4. gap - `console.log`/`inspect` don't show `Error.cause` or `AggregateError.errors`, and error output has stray blank lines

```
./dist/yavascript .tmp/gap-update/console/inspect-errors.js
```
- `new Error("outer problem", { cause: new TypeError("inner problem") })` prints only `Error { Error: outer problem / at ... }`. The cause is missing, even though `Object.getOwnPropertyNames(e)` includes `"cause"`.
- `new AggregateError([new Error("e1"), new RangeError("e2")], "many")` prints no sub-errors.
- Every error prints an empty line before `}`, and errors with extra props print two.

### 5. gap / doc - the `inspect.custom` protocol isn't documented and doesn't behave like Node's

- The d.ts only says "A symbol which can be used to customize how an object gets printed". `InspectCustomInputs` is declared but nothing references it, and none of its members or any `InspectColours` members have docs (`meta/website/docs/inspect.md:114-497`).
- Returning a string (the Node convention) is silently ignored, and the object prints normally with the custom function listed as a property (`.tmp/gap-update/console/inspect-custom2.js`). The only thing that works is mutating the passed-in `inputs` (`inputs.type = ...; inputs.propLines = [...]`), as `src/layer1/api/path/path.ts:115` does.
- `Symbol.for("nodejs.util.inspect.custom")` isn't honored (`inspect.custom === Symbol.for(...)` is `false`), so npm libraries' custom inspectors don't work.
- Numeric `InspectColours` values are 256-color indexes (`{ string: 31 }` gives `\e[38;5;31m`), which is undocumented.

### 6. doc-mismatch - console.log docs say values are "formatted using inspect", but it uses different options, and the color rules aren't documented

- `console.log` uses `{ maxDepth: 8, noAmp: true, colours: auto, indent: "  ", noSource: true }` (`src/layer1/inspect-options.ts:20-26`). The documented `inspect` defaults are `maxDepth: Infinity`, `indent: "\t"`, `noSource: false`, `noAmp: false`, `colours: false`. So `console.log(x)` and `console.log(inspect(x))` print differently, and users can't configure `console.log`'s options.
- Color auto-detection is undocumented. Results, all from real runs:

| Environment | console.log colored? |
| --- | --- |
| TTY | yes |
| TTY + `NO_COLOR=1` | yes (NO_COLOR ignored) |
| TTY + `FORCE_COLOR=0` | yes |
| TTY + `TERM=dumb` | yes |
| TTY + `CLICOLOR=0` | no |
| pipe | no |
| pipe + `CLICOLOR_FORCE=1` | yes |
| pipe + `FORCE_COLOR=1` | no |

  Source: `src/layer1/has-colors.ts:5-18`. `CLICOLOR`/`CLICOLOR_FORCE` don't appear anywhere in `yavascript.d.ts`.

### 7. gap / question - console.log doesn't support printf-style format specifiers

```
./dist/yavascript -e 'console.log("a %s b %d", "X", 42)'
```
- Actual: `a %s b %d X 42`. Node, browsers, and the WHATWG console spec substitute `%s %d %i %f %o %O %c %%`.
- This may be intentional, since `printf` exists, but it isn't documented, and code ported from Node will print the wrong thing.

### 8. question / doc - color functions always emit ANSI regardless of TTY, `NO_COLOR`, or `CLICOLOR`, and there is no public way to check or turn off color support

```
NO_COLOR=1 CLICOLOR=0 ./dist/yavascript -e 'console.log(red("x"))' </dev/null | od -c
```
- Actual: `033[31mx033[39m`

This may be intended, since they are explicit wrappers. But it isn't documented, it's inconsistent with `console.log`'s own auto-detection, and scripts that do `console.log(red("error"))` leave escapes in log files. `hasColors` isn't exposed (`grep -n "hasColors\|kleur" yavascript.d.ts` finds nothing).

### 9. doc-mismatch - `GrepMatchDetail.matches` is typed `RegExpMatchArray`, but its shape depends on the pattern

From `.tmp/gap-update/console/grep1.js`:

| Call | `matches` |
| --- | --- |
| `grepString("abab", "a", { details: true })` (string pattern, built with `g`) | `["a","a"]`, a plain array of all matches with no `index`/`input`/`groups` |
| `/a/g` | same, `.index` is `undefined` |
| `/a/` (non-global) | a real `RegExpMatchArray` with `index`, `input`, `groups` |
| `{ inverse: true, details: true }` | `null` (the type doesn't allow null) |

Source: `grep.ts:26,43`. The existing snapshots in `meta/tests/src/grep.test.ts` confirm the two shapes.

### 10. rough-edge - grep line splitting: a trailing newline creates a phantom empty line, and CRLF lines keep `\r`

- `grepString("a\nb\n", "a", { inverse: true })` gives `["b",""]`.
- On a 1,000,000-line file ending in `\n` with 1000 hits, `grepFile(file, "needle", { inverse: true }).length` is `999001` instead of 999000 (`.tmp/gap-update/console/grep-huge.js`).
- `grepString("foo\r\nbar\r\n", /foo$/)` gives `[]`, and `grepString(..., "foo")` gives `["foo\r"]`.

The docs do say "splits on `\n`", but real grep doesn't do either of these. `grepFile` also reads the whole file into memory: the 48 MB file took about 1 s and peaked at about 226 MB RSS, and there's no streaming option.

### 11. rough-edge - grep functions don't validate their input, which gives silent wrong results or cryptic errors

From `grep1.js` and the one-liners:

| Call | Result |
| --- | --- |
| `grepString("a\nb", undefined)` | `TypeError: cannot read property 'source' of undefined` |
| `grepString("null\nb", null)` | `TypeError: cannot read property 'source' of null` |
| `grepString("a5\nb", 5)` | `["a5","b"]` (matches everything) |
| `grepString(123, "1")` | `TypeError: not a function` |
| `grepString("a", "a", null)` | `cannot read property 'inverse' of null` |
| `grepArray(new Set(["a","b"]), "a", { details: true })` | `lineNumber: "a1"`, `index: "a"` (Set#forEach passes the value as the index) |
| `grepFile("src", "x")` (a directory) | `Error: Input/output error (errno = 5, filename = src)` |

A missing file gives a clear `No such file or directory (errno = 2, filename = ...)`. Any pattern that isn't a string goes to `new RegExp(pattern.source, pattern.flags)` (`grep.ts:27`), so a number becomes the empty regex.

### 12. doc-mismatch - small grep doc errors

- `grepFile` docs say `@param str - The string to search through.`, but the parameter is `path` (`src/layer1/api/grep/grep.inc.d.ts:52`).
- The `GrepMatchDetail` docblock lists `grepString`, `grepArray`, `grepFile`, and `String.prototype.grep`, but not `Array.prototype.grep` (`grep.inc.d.ts:134-136`).
- The internal option types in `grep.ts:95,109` still mention a `lineNumbers` option that doesn't exist. This is internal only.

### 13. doc-mismatch - `quote` does more than documented, rejects some numbers, and its validation is inconsistent with `stripAnsi`

- The docs say it "wraps a string in double quotes, and escapes any double-quotes inside using `\"`". It is actually `JSON.stringify`, so it also escapes backslash (`a\b` becomes `"a\\b"`), newline, tab, control chars (``), and lone surrogates (`\ud800`). It isn't shell-safe: `quote("$HOME \`id\`")` gives `"$HOME \`id\`"`. The docs should say which of these it is meant to be.
- `quote(NaN)` and `quote(Infinity)` throw `'str' argument must be a string, number, or Path` even though they are numbers, because `types.number` excludes them. The message also names `'str'` while the documented parameter is `input`.
- `stripAnsi(null)` returns `"null"`, `stripAnsi(undefined)` returns `"undefined"`, and `stripAnsi({})` returns `"[object Object]"` with no validation, while `quote` validates.

### 14. doc-mismatch - `reset` docs say it "prefixes" the string, but it wraps it

`reset("x")` gives `\e[0mx\e[0m`. `red("a" + reset("b") + "c")` gives `\e[31ma\e[0mb\e[0mc\e[39m`, so `c` loses the red. This is kleur's behavior, but the one-line doc should match.

### 15. rough-edge - `clear()` / `console.clear()` return the internal REPL sentinel `Symbol(NOTHING)` instead of `undefined`

```
./dist/yavascript -e 'console.log(String(clear()))' | cat -v
```
- Actual: `^[[2J^[[0;0H^[[3JSymbol(NOTHING)`. The d.ts says `void`.

It also writes the escape sequences when stdout isn't a TTY (question: probably should be skipped there). Source: `src/layer1/api/console/console.ts:5-9`.

### 16. rough-edge - inspect output is ambiguous for strings and keys, and Promise state isn't shown

```
./dist/yavascript -e 'console.log({ q: "say \"hi\"", bs: "a\\b", "k\"ey": 1, "": 2 }); console.log(["a\"", "b"])'
```
- Actual:
  - `q: "say "hi""` (inner quotes not escaped, while `\\` and `\n` are)
  - `k"ey: 1` (keys are never quoted, including `😀 key` and `a-b`)
  - the empty-string key prints as just `2`, with no key or colon, so it looks like an array item
  - `"a""`
- `console.log(Promise.resolve(5))` prints `Promise {}`, with no state or value. `new DataView(...)` prints `DataView {}`.

### 17. rough-edge - `Promise.map`: undocumented behavior and error messages that name internal functions

From `.tmp/gap-update/console/pmap.js`:

- A sync mapper (`Promise.map([1,2], x => x*2)`) rejects with `Mapper function passed into runJobs didn't return a Promise...`, which names the internal `runJobs`. Bluebird, which the doc cites as the inspiration, accepts non-promise return values.
- The mapper's `length` argument is `Infinity` for anything that isn't an Array (Set, generators). This isn't documented, and the type says `number`.
- On rejection, `Promise.map` rejects right away (under 80 ms) with the first error. In-flight jobs keep running (job 0 finished after the rejection), later rejections are swallowed, and no new jobs start. That's reasonable, but undocumented.
- `Promise.map(5, fn)` gives `TypeError: cannot read property 'call' of undefined`, and `Promise.map([1], "x")` gives `TypeError: not a function`.
- The generated docs render the destructured `{ concurrency }?` parameter awkwardly (`meta/generated-docs/promise-map.md:11-15,40-44`).

### 18. rough-edge - `String.dedent`: error types and messages

- An opening or closing line with content throws a plain `Error` (`invalid content on opening line`). The Stage 2 proposal spec (https://tc39.es/proposal-string-dedent/, sections 2.7 steps 7 and 15) throws `TypeError`.
- `String.dedent(5)` gives `TypeError: cannot read property 'map' of undefined`, and `String.dedent()` / `String.dedent(undefined)` give `cannot read property 'raw' of undefined`.
- The documented string-argument form is a non-standard extension: the proposal throws TypeError for non-objects (section 2.1 step 1). This is fine to keep but worth noting as a divergence.

### 19. rough-edge - `logger.info` dimming is cancelled by colored object output

```
script -q /dev/null ./dist/yavascript -e 'logger.info("msg", {a: 1})' | cat -v
```
- Actual: `^[[2mmsg^[[22m^[[2m ^[[22m^[[2m^[[38;5;237m{^[[0m ...`. inspect's `\e[0m` ends the dim after the first brace, and every argument and separator gets its own dim wrapper.

Source: `logger.ts:12,17-24`.

### 20. question - logger docs and nearby routing docs

- `logger` is described as behaving "similarly to the shell builtin `set -x`", but it doesn't say which property is the `set -x` switch. By default `trace` is a no-op and `info` is on (`exec`, `mkdir`, `copy`, and `glob` each print a dim line to stderr by default). The docs also don't say how to silence everything (`logger.info = () => {}`).
- Nearby: `which.inc.d.ts:10` documents `@param options.trace`, but the real option is `options.logging.trace`. `which("ls", { trace: fn })` never calls `fn`, while `{ logging: { trace: fn } }` does.
- Formatting of default info messages is inconsistent across APIs: `mkdir: '<path>'` (single quotes), `copy: a -> b` (no quotes), `glob: expanding ["*.txt"]` (JSON).

## Verified working

- `console.log`/`info` write to stdout, and `console.warn`/`error` write to stderr (checked with `2>/dev/null` and `1>/dev/null`). `print` and `echo` produce byte-identical output to `console.log`, including no-arg and multiple args.
- Destructured `const { log } = console` works.
- inspect handles:
  - circular refs (`-> {root}`)
  - getters (not invoked by default; `followGetters: true` invokes them)
  - Map, Set, WeakMap, typed arrays (hex dump for byte arrays), Float64Array with `-0`/`NaN`
  - class instances (`Foo { x: 1 }`), null-prototype objects, Date, RegExp
  - bigint, `-0`, symbols, symbol keys, sparse arrays (`empty × 1`), boxed primitives, frozen objects, arrays with extra props
  - depth cutoff at 8 in console.log, and 200k-char strings
- Every documented `InspectOptions` field behaves as described: `all`, `followGetters`, `indexes`, `maxDepth`, `noAmp`, `noHex`, `noSource`, `proto`, `sort`, `colours` (`true`, `8`, `256`, object), `indent`. So does the `(value, key, options)` overload (`myKey: {...}`).
- `inspect.custom` works through prototypes and nested in arrays when the function mutates `inputs`.
- Color functions:
  - all 26 produce the expected SGR codes, `gray`/`grey` use 90
  - nesting re-opens the outer style correctly (fg, bg, and bold/dim)
  - numbers and Paths are accepted
  - emoji is fine
- `stripAnsi` removes SGR, 256/truecolor, OSC 8 hyperlinks, and cursor/clear sequences.
- grep:
  - string patterns are treated literally (`"a.b"` does not match `axb`)
  - RegExp patterns, `/g` regexes (lastIndex ends at 0), `^` per line, named groups in details, `/u` with astral chars
  - `inverse`, `details`, sparse arrays (line numbers 1 and 3)
  - `new String(...).grep`, `grepFile` with a `Path`
  - `grepFile` path type validation message, missing-file error message
  - performance: about 1 s for a 48 MB / 1M-line file
- logger:
  - `logger.trace` defaults to a no-op
  - `logger.info` defaults to text on stderr and `logger.warn` to yellow text on stderr, dim/yellow only when stderr is a terminal (or with `CLICOLOR_FORCE`)
  - setters reject non-functions (`TypeError: 'logger.info' must be a function`)
  - changing them at runtime reroutes `exec`, `ChildProcess`, `which`, `glob`, `copy`, `mkdir`, `Promise.map` (trace), and `readEnvBool` (warn), as shown by `.tmp/gap-update/console/logger-routing.js`
- `Promise.map`:
  - default concurrency is 8 (max active 8 with 20 timer jobs), and `concurrency: 3` caps at 3
  - results come back in input order even when completion order is reversed
  - accepts Set, generator (yielded promises are awaited), and async generator input
  - empty array gives `[]`
  - the iterator is pulled lazily (2 items pulled at concurrency 2)
  - a sync throw in the mapper rejects
- `String.dedent`:
  - tag form, interpolation (values aren't re-indented), escapes (`\t`, `\n`, `\u{1F600}`, escaped backtick and `\${`), whitespace-only lines emptied
  - mixed tab/space common prefix, string form, CRLF string form
  - wrapper form (`String.dedent(fn)`), `String.dedent(String.raw)` keeps the raw text
  - template cache identity
  - opening/closing line errors match the documented "first line must be empty" rule
- `RegExp.escape` is the engine's native, spec-compliant version, and it is non-enumerable.

## Test coverage notes

- **console** (`meta/tests/src/console.test.ts`): covers string and plain-object output, stdout/stderr routing, write ordering when piped, `console.error` staying uncolored when only stderr is redirected, and surviving a revoked Proxy. Untested:
  - `print`, `clear`/`console.clear` outside the REPL, and `clear()`'s return value
  - color output on a TTY or with `CLICOLOR`/`CLICOLOR_FORCE`, and stdout redirected while stderr is a terminal
  - inspect edge cases: circular refs, errors with `cause`, AggregateError, `inspect.custom`
- **inspect**: no dedicated test file. The options and the custom-inspect protocol have no tests.
- **strings** (`strings.test.ts`): covers each function with a string/number/Path. Untested:
  - nesting
  - `quote` with backslash, newline, or NaN
  - `stripAnsi` with OSC/cursor sequences or non-string input
  - `reset` inside another color
- **grep** (`grep.test.ts`): happy paths, non-enumerable prototype methods, and sticky-regex state. Untested:
  - a `/g` RegExp's `lastIndex`
  - CRLF, missing file, directory (the `inverse` snapshots do include a trailing newline, and assert the phantom empty line from finding 10)
  - pattern validation, `details` match shape for a `/g` RegExp
- **logger** (`logger.test.ts`): untested:
  - coloring of object arguments when only stderr is redirected
  - setter validation
  - routing for `which`, `glob`, `copy`, `mkdir`, `Promise.map`, `readEnvBool`
- **Promise.map** (`promise-map.test.ts`): covers the concurrency cap, NaN and non-numeric `concurrency`, and non-enumerability. Untested:
  - rejection behavior (fail-fast, orphaned in-flight jobs, swallowed later rejections)
  - result ordering with out-of-order completion
  - Set, generator, and async-iterable inputs, and the `length` argument
  - `concurrency: 0`, sync mapper error
- **String.dedent** (`string-dedent.test.ts`): only the hex-escape-before-interpolation case and non-enumerability. Untested: the ordinary tag, string, and wrapper forms, the opening/closing-line errors, and non-template arguments.
