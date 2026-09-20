# API audit: console, inspect, strings, grep, logger, RegExp.escape, String.dedent, Promise.map

Binary: `./dist/yavascript` (`-v` reports `git-3eedd831a85c`). All commands run from the repo root with `</dev/null`. Scratch scripts are in `.tmp/api-audit/console-sandbox/`.

## Findings

### 1. bug - console.log / console.info / print / echo: stdout is never flushed, so output is reordered when stdout is a pipe or file

When stdout is not a TTY it is block-buffered, and nothing flushes it before stderr writes, before child processes run, or before an uncaught error is printed. On a TTY it's fine (line-buffered). This hits every script run in CI or redirected to a log file.

```
./dist/yavascript -e 'console.log("1 parent out"); exec(["echo", "2 child out"]); console.log("3 parent out")' </dev/null 2>/dev/null | cat
```
- Expected: `1 parent out`, `2 child out`, `3 parent out`
- Actual: `2 child out`, `1 parent out`, `3 parent out`

```
./dist/yavascript -e 'console.log("1 out"); console.error("2 err"); console.log("3 out")' </dev/null > .tmp/api-audit/console-sandbox/order.txt 2>&1
```
- Actual file contents: `2 err`, `1 out`, `3 out`

```
./dist/yavascript -e 'console.log("before throw"); throw new Error("boom")' </dev/null 2>&1 | cat
```
- Actual: the `Error: boom` block prints first, then `before throw`.

Source: `src/layer1/api/shared/make-inspect-log.ts:62-67` writes with `file.puts` and never flushes. The only `flush()` in `src/` is `src/layer1/api/repl/repl-engine.ts:319`. ChildProcess start does not flush `std.out` before spawning.

### 2. bug - `Array.prototype.grep` and `String.prototype.grep` are enumerable, so `for...in` over any array or string yields `"grep"`

```
./dist/yavascript -e 'const k = []; for (const i in ["x"]) k.push(i); console.log(k)'
```
- Expected: `["0"]`
- Actual: `["0", "grep"]` (same for `for (const k in "x")`)

`Object.getOwnPropertyDescriptor(Array.prototype, "grep").enumerable` and the String equivalent are both `true`. Any library (including ones loaded via `npm:`) that does `for...in` over arrays gets a function as a key.

Source: `src/layer1/api/grep/grep.ts:85` and `:94` use plain assignment instead of `Object.defineProperty(..., { enumerable: false })`.

### 3. bug - `RegExp.escape` replaces the engine's native, spec-compliant `RegExp.escape` with a non-compliant version

The embedded QuickJS already ships the standard function (`node_modules/@suchipi/quickjs/build/aarch64-apple-darwin/bin/qjs -e 'print(RegExp.escape("a-z"))'` prints `\x61\x2dz`), and yavascript overwrites it with a regex that only escapes `^$\.*+?()[]{}|`. The proposal is now Stage 4 (confirmed at https://github.com/tc39/proposal-regex-escaping), but the doc still says "stage 2".

```
./dist/yavascript -e 'console.log(RegExp.escape("a-c"), new RegExp("[" + RegExp.escape("a-c") + "]").test("b"))'
```
- Expected: `\x61\x2dc false` (Node v24.21.0 gives `\x61\x2dz` for `"a-z"`)
- Actual: `a-c true`. The escaped text changes meaning inside a character class.

Other divergences, from `.tmp/api-audit/console-sandbox/regexp-escape.js` compared against Node 24's native implementation:

| Input | yavascript | spec (Node 24) |
| --- | --- | --- |
| `"a/b"` | `a/b` | `\x61\/b` |
| `"1abc"` (leading digit) | `1abc` | `\x31abc` |
| `"abc"` (leading letter) | `abc` | `\x61bc` |
| `",=<>#&!%:;@~'\`\""` | unchanged | each `\xNN` |
| `" \t\n"` | unchanged | `\x20\t\n` |
| `123` (non-string) | `"123"` | TypeError `input argument must be a string` |

Consequences seen: `new RegExp("\\1" + RegExp.escape("2"))` has source `\12` (turns into a different escape), and `new RegExp(RegExp.escape("a-b") + "|x", "v")` throws `invalid character in class in regular expression`.

Source: `src/layer1/api/regexp-escape/regexp-escape.ts:2-8`, installed at `src/layer1/api/_install-api.ts:239`. The grep functions import the same `escape` (`grep.ts:2,24`), which is fine for their use.

### 4. bug - `console.error` / `console.warn` decide whether to colorize based on whether stdout is a TTY, not the stream they write to

```
script -q /dev/null sh -c "./dist/yavascript -e 'console.error({a:1})' 2>.tmp/api-audit/console-sandbox/err-to-file.txt" </dev/null >/dev/null
od -c .tmp/api-audit/console-sandbox/err-to-file.txt | head -2
```
- Expected: a plain `{\n  a: 1\n}` in the file (stderr is a file)
- Actual: `033[38;5;237m{033[0m ...` escapes written to the file

The opposite case fails too: `./x.js > out.txt` in a terminal gives uncolored `console.error` output on the TTY.

Source: `src/layer1/has-colors.ts:17` (`os.isatty(std.out.fileno())`), used by `inspectOptions.forPrint()` (`src/layer1/inspect-options.ts:21`), which `make-inspect-log.ts:18,47` uses for every target FILE. It also affects object args passed to `logger.info`/`logger.warn`.

### 5. bug - `logger.info` / `logger.warn` always write ANSI escapes to stderr, even when stderr is not a TTY and even with `CLICOLOR=0`

The defaults for `exec`, `mkdir`, `copy`, and `glob` all log through `logger.info`, so every log file gets escape codes.

```
CLICOLOR=0 ./dist/yavascript -e 'exec("true")' </dev/null 2>&1 >/dev/null | od -c
```
- Expected: `exec: true\n`
- Actual: `033[2mexec: true033[22m\n`

`logger.warn` (for example from `FOO=maybe ./dist/yavascript -e 'readEnvBool("FOO", "fb")'`) always writes `033[33m...033[39m`.

Source: `src/layer1/api/logger/logger.ts:15,25` call `dim`/`yellow` from `strings.ts`, which sets `kleur.enabled = true` unconditionally (`src/layer1/api/strings/strings.ts:5`). This disagrees with `console.log`, which does respect `CLICOLOR`.

### 6. bug - grep functions with a sticky (`/y`) RegExp: `lastIndex` carries over between lines and between calls, and the caller's RegExp gets mutated

```
./dist/yavascript -e 'const re = /a/y; console.log(grepArray(["a","a","a"], re), re.lastIndex, grepArray(["a"], re))'
```
- Expected: `["a","a","a"] 0 ["a"]`
- Actual: `["a","a"] 1 []`

Source: `src/layer1/api/grep/grep.ts:39`. `String(item).match(regexp)` on a non-global sticky regex goes through `RegExpBuiltinExec`, which reads and writes `lastIndex`. `/g` regexes are fine: `match` resets `lastIndex` to 0, and afterwards it is 0.

### 7. bug - `Promise.map` with `concurrency: NaN` (or a non-numeric string) resolves right away to an array of holes and never calls the mapper

```
./dist/yavascript -e 'Promise.map([1,2,3], async (x) => { console.log("called", x); return x }, { concurrency: NaN }).then((r) => console.log(r.length, Object.keys(r)))'
```
- Expected: a TypeError/RangeError, or a sensible default
- Actual: `3 []`, and the mapper is never called. `concurrency: "abc"` does the same.

Other values, from `.tmp/api-audit/console-sandbox/pmap.js`:

| `concurrency` | Result |
| --- | --- |
| `0`, `-1`, `null` | throws `Concurrency can't be less than one; that doesn't make any sense.` |
| `Infinity` | works, everything runs at once |
| `2.5` | works, max active is 3 |
| `"2"` | coerced to 2 |

Source: `node_modules/@parallel-park/run-jobs/dist/run-jobs.js:31` (`concurrency < 1` is false for NaN) and `:94` (`size < NaN` is false, so nothing starts). `src/layer1/api/promise-map/promise-map.ts:11-12` does no validation.

### 8. bug - `console.log` can throw and leave partial output when inspect fails and `String(value)` also fails

```
./dist/yavascript -e 'const r = Proxy.revocable({}, {}); r.revoke(); console.log("v:", r.proxy); console.log("after")'
```
- Expected: some placeholder output, then `after`
- Actual: stderr gets a bare `revoked proxy` line, then an uncaught `TypeError: revoked proxy at String (native) at inspectManyToFile ...`. stdout gets `v: ` with no newline, and the exit code is 1.

A null-prototype object whose `inspect.custom` throws does the same thing (`TypeError: failed to convert value to primitive`). Even when the fallback works, the user only sees the bare inner error message (for example `boom in custom`) on stderr, with no context.

Source: `src/layer1/api/shared/make-inspect-log.ts:46-55` (and the copy at `:17-26`). The fallback `String(arg)` is outside any try.

### 9. bug (upstream dependency) - `String.dedent` throws when a `\xHH` or `\uHHHH` escape comes right before `${...}`

```js
// .tmp/api-audit/console-sandbox/dedent.js
String.dedent`
    A=\x41${"!"}
  `
```
- Expected: `"A=A!"`
- Actual: `TypeError: invalid cooked string at index 0`. The same happens with `A`. `\u{41}` works, and `\x41 ${"!"}` (with a space) works.

Source: `node_modules/string-dedent/dist/dedent.mjs:239` (and `dedent.umd.js:245`). `parseHex` has `if (end >= str.length) return -1;`, an off-by-one when the escape ends exactly at the end of a quasi. Reproduced in Node with the same package file (`TypeError invalid cooked string at index 0`). string-dedent version is 3.0.2.

### 10. bug - color functions return a kleur chain object, not a string, when called with no argument or `undefined`

```
./dist/yavascript -e 'console.log(typeof red(), typeof red(undefined), JSON.stringify(red().bold("x")))'
```
- Expected (per d.ts `): string`): `"string"`, or a TypeError
- Actual: `object object "[31m[1mx[39m[22m"`

So `red(maybeUndefined)` quietly produces an object with 28 keys (`has`, `keys`, `reset`, `bold`, ...). The chaining API (`red().bold("x")`) works but isn't documented, and `red.bold` is `undefined`.

Source: `src/layer1/api/strings/strings.ts:32-59` re-exports kleur 4.1.5's functions directly. kleur's `init()` returns `chain(...)` when `txt === undefined`.

### 11. gap - most standard `console` methods are missing, and calling one gives an unhelpful error

`console` only has `log, info, warn, error, clear`. `debug`, `trace`, `dir`, `dirxml`, `table`, `group`, `groupEnd`, `time`, `timeEnd`, `timeLog`, `count`, `countReset`, and `assert` are all `undefined`.

```
./dist/yavascript -e "console.debug('x')"
```
- Actual: `TypeError: not a function at <internal>/quickjs.c:18333:0`, exit 1. The message doesn't name the method.

Third-party code loaded through `npm:`/`http:` imports often calls `console.debug`/`console.trace`/`console.time`, and it will crash. For TypeScript users who also pull in `lib.dom` or `@types/node`, these calls typecheck and then fail at runtime. Source: `src/layer1/api/console/console.ts:12-18`.

### 12. gap - `console.log`/`inspect` don't show `Error.cause` or `AggregateError.errors`, and error output has stray blank lines

```
./dist/yavascript .tmp/api-audit/console-sandbox/inspect-errors.js
```
- `new Error("outer problem", { cause: new TypeError("inner problem") })` prints only `Error { Error: outer problem / at ... }`. The cause is missing, even though `Object.getOwnPropertyNames(e)` includes `"cause"`.
- `new AggregateError([new Error("e1"), new RangeError("e2")], "many")` prints no sub-errors.
- Every error prints an empty line before `}`, and errors with extra props print two.

### 13. gap / doc - the `inspect.custom` protocol isn't documented and doesn't behave like Node's

- The d.ts only says "A symbol which can be used to customize how an object gets printed". `InspectCustomInputs` is declared but nothing references it, and none of its members or any `InspectColours` members have docs (`meta/website/docs/inspect.md:114-497`).
- Returning a string (the Node convention) is silently ignored, and the object prints normally with the custom function listed as a property (`.tmp/api-audit/console-sandbox/inspect-custom2.js`). The only thing that works is mutating the passed-in `inputs` (`inputs.type = ...; inputs.propLines = [...]`), as `src/layer1/api/path/path.ts:113` does.
- `Symbol.for("nodejs.util.inspect.custom")` isn't honored (`inspect.custom === Symbol.for(...)` is `false`), so npm libraries' custom inspectors don't work.
- Numeric `InspectColours` values are 256-color indexes (`{ string: 31 }` gives `\e[38;5;31m`), which is undocumented.

### 14. doc-mismatch - console.log docs say values are "formatted using inspect", but it uses different options, and the color rules aren't documented

- `console.log` uses `{ maxDepth: 8, noAmp: true, colours: auto, indent: "  ", noSource: true }` (`src/layer1/inspect-options.ts:18-24`). The documented `inspect` defaults are `maxDepth: Infinity`, `indent: "\t"`, `noSource: false`, `noAmp: false`, `colours: false`. So `console.log(x)` and `console.log(inspect(x))` print differently, and users can't configure `console.log`'s options.
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

### 15. gap / question - console.log doesn't support printf-style format specifiers

```
./dist/yavascript -e 'console.log("a %s b %d", "X", 42)'
```
- Actual: `a %s b %d X 42`. Node, browsers, and the WHATWG console spec substitute `%s %d %i %f %o %O %c %%`.
- This may be intentional, since `printf` exists, but it isn't documented, and code ported from Node will print the wrong thing.

### 16. question / doc - color functions always emit ANSI regardless of TTY, `NO_COLOR`, or `CLICOLOR`, and there is no public way to check or turn off color support

```
NO_COLOR=1 CLICOLOR=0 ./dist/yavascript -e 'console.log(red("x"))' </dev/null | od -c
```
- Actual: `033[31mx033[39m`

This may be intended, since they are explicit wrappers. But it isn't documented, it's inconsistent with `console.log`'s own auto-detection, and scripts that do `console.log(red("error"))` leave escapes in log files. `hasColors` isn't exposed (`grep -n "hasColors\|kleur" yavascript.d.ts` finds nothing).

### 17. doc-mismatch - `GrepMatchDetail.matches` is typed `RegExpMatchArray`, but its shape depends on the pattern

From `.tmp/api-audit/console-sandbox/grep1.js`:

| Call | `matches` |
| --- | --- |
| `grepString("abab", "a", { details: true })` (string pattern, built with `g`) | `["a","a"]`, a plain array of all matches with no `index`/`input`/`groups` |
| `/a/g` | same, `.index` is `undefined` |
| `/a/` (non-global) | a real `RegExpMatchArray` with `index`, `input`, `groups` |
| `{ inverse: true, details: true }` | `null` (the type doesn't allow null) |

Source: `grep.ts:24,39`. The existing snapshots in `meta/tests/src/grep.test.ts` confirm the two shapes.

### 18. rough-edge - grep line splitting: a trailing newline creates a phantom empty line, and CRLF lines keep `\r`

- `grepString("a\nb\n", "a", { inverse: true })` gives `["b",""]`.
- On a 1,000,000-line file ending in `\n` with 1000 hits, `grepFile(file, "needle", { inverse: true }).length` is `999001` instead of 999000 (`.tmp/api-audit/console-sandbox/grep-huge.js`).
- `grepString("foo\r\nbar\r\n", /foo$/)` gives `[]`, and `grepString(..., "foo")` gives `["foo\r"]`.

The docs do say "splits on `\n`", but real grep doesn't do either of these. `grepFile` also reads the whole file into memory: the 48 MB file took about 1 s and peaked at 343 MB RSS, and there's no streaming option.

### 19. rough-edge - grep functions don't validate their input, which gives silent wrong results or cryptic errors

From `grep1.js` and the one-liners:

| Call | Result |
| --- | --- |
| `grepString("a\nb", undefined)` | `["a","b"]` (matches everything) |
| `grepString("null\nb", null)` | `["null"]` |
| `grepString("a5\nb", 5)` | `["a5"]` |
| `grepString(123, "1")` | `TypeError: not a function` |
| `grepString("a", "a", null)` | `cannot read property 'inverse' of null` |
| `grepArray(new Set(["a","b"]), "a", { details: true })` | `lineNumber: "a1"`, `index: "a"` (Set#forEach passes the value as the index) |
| `grepFile("src", "x")` (a directory) | `Error: Input/output error (errno = 5, filename = src)` |

A missing file gives a clear `No such file or directory (errno = 2, filename = ...)`.

### 20. doc-mismatch - small grep doc errors

- `grepFile` docs say `@param str - The string to search through.`, but the parameter is `path` (`src/layer1/api/grep/grep.inc.d.ts:52`).
- The `GrepMatchDetail` docblock lists `grepString`, `grepArray`, `grepFile`, and `String.prototype.grep`, but not `Array.prototype.grep` (`grep.inc.d.ts:134-136`).
- The internal option types in `grep.ts:87,96` still mention a `lineNumbers` option that doesn't exist. This is internal only.

### 21. doc-mismatch - `quote` does more than documented, rejects some numbers, and its validation is inconsistent with `stripAnsi`

- The docs say it "wraps a string in double quotes, and escapes any double-quotes inside using `\"`". It is actually `JSON.stringify`, so it also escapes backslash (`a\b` becomes `"a\\b"`), newline, tab, control chars (``), and lone surrogates (`\ud800`). It isn't shell-safe: `quote("$HOME \`id\`")` gives `"$HOME \`id\`"`. The docs should say which of these it is meant to be.
- `quote(NaN)` and `quote(Infinity)` throw `'str' argument must be a string, number, or Path` even though they are numbers, because `types.number` excludes them. The message also names `'str'` while the documented parameter is `input`.
- `stripAnsi(null)` returns `"null"`, `stripAnsi(undefined)` returns `"undefined"`, and `stripAnsi({})` returns `"[object Object]"` with no validation, while `quote` validates. Colors accept anything as well (`red(null)` gives `\e[31mnull\e[39m`).

### 22. doc-mismatch - `reset` docs say it "prefixes" the string, but it wraps it

`reset("x")` gives `\e[0mx\e[0m`. `red("a" + reset("b") + "c")` gives `\e[31ma\e[0mb\e[0mc\e[39m`, so `c` loses the red. This is kleur's behavior, but the one-line doc should match.

### 23. rough-edge - `clear()` / `console.clear()` return the internal REPL sentinel `Symbol(NOTHING)` instead of `undefined`

```
./dist/yavascript -e 'console.log(String(clear()))' | cat -v
```
- Actual: `^[[2J^[[0;0H^[[3JSymbol(NOTHING)`. The d.ts says `void`.

It also writes the escape sequences when stdout isn't a TTY (question: probably should be skipped there). Source: `src/layer1/api/console/console.ts:5-9`.

### 24. rough-edge - inspect output is ambiguous for strings and keys, and Promise state isn't shown

```
./dist/yavascript -e 'console.log({ q: "say \"hi\"", bs: "a\\b", "k\"ey": 1, "": 2 }); console.log(["a\"", "b"])'
```
- Actual:
  - `q: "say "hi""` (inner quotes not escaped, while `\\` and `\n` are)
  - `k"ey: 1` (keys are never quoted, including `😀 key` and `a-b`)
  - the empty-string key prints as just `2`, with no key or colon, so it looks like an array item
  - `"a""`
- `console.log(Promise.resolve(5))` prints `Promise {}`, with no state or value. `new DataView(...)` prints `DataView {}`.

### 25. rough-edge - `Promise.map`: undocumented behavior and error messages that name internal functions

From `.tmp/api-audit/console-sandbox/pmap.js`:

- A sync mapper (`Promise.map([1,2], x => x*2)`) rejects with `Mapper function passed into runJobs didn't return a Promise...`, which names the internal `runJobs`. Bluebird, which the doc cites as the inspiration, accepts non-promise return values.
- The mapper's `length` argument is `Infinity` for anything that isn't an Array (Set, generators). This isn't documented, and the type says `number`.
- On rejection, `Promise.map` rejects right away (under 80 ms) with the first error. In-flight jobs keep running (job 0 finished after the rejection), later rejections are swallowed, and no new jobs start. That's reasonable, but undocumented.
- `Promise.map(5, fn)` gives `TypeError: cannot read property 'call' of undefined`, and `Promise.map([1], "x")` gives `TypeError: not a function`.
- The generated docs render the destructured `{ concurrency }?` parameter awkwardly (`meta/generated-docs/promise-map.md:11-15,40-44`).

### 26. rough-edge - `String.dedent`: error types and messages

- An opening or closing line with content throws a plain `Error` (`invalid content on opening line`). The Stage 2 proposal spec (https://tc39.es/proposal-string-dedent/, sections 2.7 steps 7 and 15) throws `TypeError`.
- `String.dedent(5)` gives `TypeError: cannot read property 'map' of undefined`, and `String.dedent()` / `String.dedent(undefined)` give `cannot read property 'raw' of undefined`.
- The documented string-argument form is a non-standard extension: the proposal throws TypeError for non-objects (section 2.1 step 1). This is fine to keep but worth noting as a divergence.

### 27. rough-edge - `logger.info` dimming is cancelled by colored object output

```
script -q /dev/null ./dist/yavascript -e 'logger.info("msg", {a: 1})' | cat -v
```
- Actual: `^[[2mmsg^[[22m^[[2m ^[[22m^[[2m^[[38;5;237m{^[[0m ...`. inspect's `\e[0m` ends the dim after the first brace, and every argument and separator gets its own dim wrapper.

Source: `logger.ts:12-17`.

### 28. question - logger docs and nearby routing docs

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
  - `logger.info` defaults to dim text on stderr and `logger.warn` to yellow text on stderr
  - setters reject non-functions (`TypeError: 'logger.info' must be a function`)
  - changing them at runtime reroutes `exec`, `ChildProcess`, `which`, `glob`, `copy`, `mkdir`, `Promise.map` (trace), and `readEnvBool` (warn), as shown by `.tmp/api-audit/console-sandbox/logger-routing.js`
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
- `RegExp.escape` escapes all regex syntax characters (it's the extra spec-mandated escapes that are missing), and it is non-enumerable.

## Test coverage notes

- **console** (`meta/tests/src/console.test.ts`): only string and plain-object output and stdout/stderr routing are covered. Untested:
  - `print`, `clear`/`console.clear` outside the REPL, and `clear()`'s return value
  - color output on a TTY or with `CLICOLOR`/`CLICOLOR_FORCE`, and which stream decides color
  - stdout/stderr/child-process ordering when piped
  - inspect edge cases: circular refs, errors with `cause`, AggregateError, inspect failure fallback, `inspect.custom`
- **inspect**: no dedicated test file. The options and the custom-inspect protocol have no tests.
- **strings** (`strings.test.ts`): covers each function with a string/number/Path. Untested:
  - nesting, `undefined`/no-arg calls (which return a chain object)
  - `quote` with backslash, newline, or NaN
  - `stripAnsi` with OSC/cursor sequences or non-string input
  - `reset` inside another color
- **grep** (`grep.test.ts`): happy paths only. Untested:
  - sticky regex state leak, `/g` lastIndex
  - enumerability of the prototype methods
  - CRLF, trailing newline with `inverse`, missing file, directory
  - pattern validation, `details` match shape for `/g`
- **logger** (`logger.test.ts`): untested:
  - `logger.warn` (no test at all)
  - ANSI output to non-TTY stderr (the default sanitizers hide the escapes, which is why the snapshots show plain `exec: true`)
  - setter validation
  - routing for `which`, `glob`, `copy`, `mkdir`, `Promise.map`, `readEnvBool`
- **Promise.map** (`promise-map.test.ts`): one concurrency test. Untested:
  - rejection behavior (fail-fast, orphaned in-flight jobs, swallowed later rejections)
  - result ordering with out-of-order completion
  - Set, generator, and async-iterable inputs, and the `length` argument
  - invalid `concurrency` (NaN, 0, strings), sync mapper error
- **RegExp.escape and String.dedent**: no functional tests at all (`grep -rn "RegExp.escape\|String.dedent" meta/tests/src/` finds nothing). A test comparing against the native/spec output would have caught findings 3 and 9.
