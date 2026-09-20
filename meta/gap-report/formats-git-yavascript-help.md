# API audit: YAML, CSV, TOML, GitRepo, yavascript, help

Binary under test: `./dist/yavascript` (version `git-3eedd831a85c`, arm64). All commands were run from the repo root with `</dev/null`. Scratch scripts referenced below live in `.tmp/api-audit/formats-sandbox/`.

Bundled library versions (from `node_modules/*/package.json`): yaml 2.9.0, papaparse 5.5.4, @iarna/toml 2.2.5, sucrase 3.35.1, coffeescript 2.7.0, @danielx/civet 0.11.14.

## Findings

### 1. bug - CSV.parse: fails or adds a junk row on ordinary CSV (trailing newline, blank lines, single column, empty input)

- Repro:
  - `./dist/yavascript -e 'JSON.stringify(CSV.parse("a,b\nc,d\n"))'`
  - `./dist/yavascript -e 'JSON.stringify(CSV.parse("a,b,c\nd,e,f\n"))'`
  - `./dist/yavascript -e 'JSON.stringify(CSV.parse("a\nb"))'`
  - `./dist/yavascript -e 'const small = "a,b\n".repeat(5); const big = "a,b\n".repeat(12); for (const [n, s] of [["5 rows", small], ["12 rows", big]]) { try { const r = CSV.parse(s); console.log(n, "rows returned:", r.length, "last:", JSON.stringify(r[r.length - 1])); } catch (e) { console.log(n, "THREW", e.message); } }'`
- Expected: `[["a","b"],["c","d"]]`, `[["a","b","c"],["d","e","f"]]`, `[["a"],["b"]]`; a trailing newline (which nearly every CSV file on disk has) should not matter.
- Actual:
  - `Error: CSV parse failed: Row 1: UndetectableDelimiter: Unable to auto-detect delimiting character; defaulted to ','`
  - `[["a","b","c"],["d","e","f"],[""]]` (extra empty row)
  - same UndetectableDelimiter error for single-column data, `""`, `"\n"`, 2-column input with a blank line (`"a,b\n\nc,d"`), and `"a,b,c\n\nd,e,f\n\n"`
  - 5-row 2-column file with trailing newline throws; the same data with 12 rows parses and returns 13 rows, the last being `[""]`. `CSV.parse(readFile("people.csv"))` on a normal 3-line file throws.
- Cause: `src/layer1/api/csv/csv.ts:9` calls `Papa.parse(input, { header: false })` with no `delimiter` and no `skipEmptyLines`, so Papa auto-detects the delimiter. Its guesser (`node_modules/papaparse/papaparse.js:1354-1383`) only looks at the first 10 rows and requires an average field count > 1.99; the empty row produced by a trailing newline drags 2-column data below that. Papa still parses with `,` and reports `UndetectableDelimiter` as a soft warning (`papaparse.js:1209`), but `csv.ts:10-29` treats every entry in `errors` as fatal. Round-trips also break: `CSV.parse(CSV.stringify([["a"],["b"]]))`, `CSV.parse(CSV.stringify([]))`, and `CSV.parse(CSV.stringify([["a","b"],[""],["c","d"]]))` all throw.

### 2. bug - CSV.parse: undocumented delimiter autodetection silently splits data on `;`, tab, or `|`

- Repro: `./dist/yavascript -e 'JSON.stringify(CSV.parse(CSV.stringify([["a;b"],["c;d"]])))'`
- Expected: `[["a;b"],["c;d"]]` (docs describe comma-separated values; `csv.inc.d.ts:2-7`).
- Actual: `[["a","b"],["c","d"]]`. Also `CSV.parse("a;b;c\nd;e;f")` and `CSV.parse("a\tb\tc\nd\te\tf")` are split on `;` / tab. Passing options does nothing: `CSV.parse("a,b", { delimiter: ";" })` returns `[["a","b"]]`.
- Cause: same as #1 (`csv.ts:9`, no fixed delimiter).

### 3. bug - yavascript.compilers.autodetect / extensionless files: files without an extension are never compiled

- Repro (files in the sandbox):
  - `./dist/yavascript .tmp/api-audit/formats-sandbox/ts-noext` (content `const a: number = 1; ...`)
  - `./dist/yavascript .tmp/api-audit/formats-sandbox/civet-noext`
  - `./dist/yavascript --lang coffee .tmp/api-audit/formats-sandbox/coffee-noext` (this is the exact form shown in `yavascript --help`: `yavascript --lang 'coffee' ./myscript`)
  - `./dist/yavascript .tmp/api-audit/formats-sandbox/import-noext.js` (does `require("./ts-noext")` and `import("./civet-noext")`)
- Expected: per `yavascript.inc.d.ts:109-123` autodetect is "the function yavascript uses internally to load files which don't have an extension", and CLI help (`src/layer5b/targets/help.ts:34-35`) says the language of an extensionless file is inferred from its contents. `--lang coffee` should force CoffeeScript.
- Actual: all four run the raw source as JS: `SyntaxError: missing initializer for const variable`, `SyntaxError: unexpected token in expression: '='`, `SyntaxError: unexpected token in expression: '>'` (the `--lang coffee` run included). `yavascript --lang ts <extensionless>` fails the same way.
- Cause: `src/layer1/extension-handlers/empty.ts:4` registers the handler as `ModuleDelegate.compilers[""]`, and `src/layer5b/targets/run-file.ts:14-20` overrides `compilers[extname(file)]`, which is also `""` for extensionless files. The engine now treats keys without a leading dot as import-attribute `type` names (documented at `yavascript.d.ts:6388-6392`), so `""` never matches a file extension. Confirmed: `import x from "./ts-noext" with { type: "" }` (`import-noext-attr.js`) does compile the file (it gets as far as `Could not find export 'default'`).

### 4. bug - TOML.parse: a local time without fractional seconds followed by a newline is a parse error

- Repro: `./dist/yavascript -e 'JSON.stringify(TOML.parse("t = 07:32:00\nl = 1"))'`
- Expected: `{ t: <07:32:00>, l: 1 }`.
- Actual: `TomlError: Unexpected character, expected only whitespace or comments till end of line at row 2, col 1, pos 14`. Works if the time is at EOF, followed by a space or comment, has a fraction (`07:32:00.5`), or uses CRLF. `[a]\nt = 07:32:00\n[b]` and `x = [07:32:00, 08:00:00]` also fail. Script: `toml3.js`.
- Cause: upstream `node_modules/@iarna/toml/lib/toml-parser.js:1143` uses `this.return(...)` (consumes the next char, the LF) where the sibling fraction path at `:1151` uses `this.returnNow(...)`. @iarna/toml 2.2.5 is the latest release and is unmaintained, so this needs a patch or a library swap.

### 5. bug - importing `.toml` / `.yaml` / `.yml` files is lossy (Dates, Infinity/NaN, Sets) or crashes (BigInt)

- Repro: `./dist/yavascript .tmp/api-audit/formats-sandbox/import-test.js` (compares `TOML.parse(readFile(...))` with `require("./data.toml")`, same for YAML, and requires `big.toml` containing `big = 9007199254740993`).
- Expected: `require` gives the same value as `TOML.parse` / `YAML.parse` of the file.
- Actual: direct parse gives `when: 1979-05-27T07:32:00.000Z` (Date), `inf: Infinity`, `nan: NaN`, `set: Set {...}`; the imported module gives `when: "1979-05-27T07:32:00.000Z"` (string), `inf: null`, `nan: null`, `set: {}`. Requiring `big.toml` throws `TypeError: Do not know how to serialize a BigInt` (no filename in the message).
- Cause: `src/layer1/extension-handlers/toml.ts:3-9` and `src/layer1/extension-handlers/yaml.ts:3-9` embed the parsed data with `JSON.stringify(data, null, 2)`. Embedding the source text and calling `TOML.parse`/`YAML.parse` at module-evaluation time (as the json5 loader does with `std.parseExtJSON`) would avoid this.

### 6. bug - GitRepo: all methods follow an inherited `GIT_DIR`, so they can report on a different repo

- Repro: `env GIT_DIR=/Users/suchipi/Code/uiohook-napi/.git ./dist/yavascript -e 'logger.info = () => {}; const r = new GitRepo("/Users/suchipi/Code/yavascript"); console.log("repoDir:", r.repoDir.toString(), "commitSHA:", r.commitSHA(), "branch:", r.branchName())'`
- Expected: yavascript's HEAD `3eedd831a85cfc2081b04eac44c93088cce14963`, branch `main`.
- Actual: `repoDir: /Users/suchipi/Code/yavascript commitSHA: 2d7f9cb3f97423bda6920a54f58979a84ae50865 branch: fix/macos-main-thread-deadlock` (the other repo's values). `man githooks` says git exports `GIT_DIR`, `GIT_WORK_TREE`, etc. to hooks and that hooks touching a foreign repo "should clear these environment variables", so a yavascript git hook that inspects another repo gets wrong answers.
- Cause: `src/layer1/api/git-repo/git-repo.ts:84-88, 105-109, 134-138, 190-194` rely only on `cwd`; passing `--git-dir`/`--work-tree` or clearing `GIT_DIR`/`GIT_WORK_TREE`/`GIT_INDEX_FILE` in the child env would pin them to `repoDir`.

### 7. bug - TOML.parse: integers beyond int64 silently wrap instead of erroring

- Repro: `./dist/yavascript -e 'TOML.parse("n = 9223372036854775808").n'`
- Expected: a parse error (the TOML spec requires out-of-range integers to be rejected).
- Actual: `-9223372036854775808n`.
- Cause: `node_modules/@iarna/toml/lib/toml-parser.js:189` (`BigInt.asIntN(64, value)`). Also undocumented: integers come back as `number` when safe (`n = 42` gives `number`) and `bigint` otherwise (`9007199254740993` gives `bigint`), so the type of a field depends on its value.

### 8. doc-mismatch (likely bug) - GitRepo.isWorkingTreeDirty: documented command doesn't exist; actual command misses staged and untracked changes

- Docs (`git-repo.inc.d.ts:163-168`): "Returns a boolean indicating whether there are uncommited changes ... This is done by running `git status --quiet`". `commitSHA` docs (`:136-138`) recommend it for detecting "unstaged or uncommitted changes".
- Actual: `git-repo.ts:134` runs `git diff --quiet`. The stderr log from `.tmp/api-audit/formats-sandbox/git1.js` shows `exec: git diff --quiet`. `git status -h` lists no `--quiet` option at all. `man git-diff` says the no-argument form shows "changes you made relative to the index", so staged-but-uncommitted changes and untracked files report `false` (clean).
- Not reproduced at runtime: the audit rules forbid staging or creating files in any repo, and a broad read-only scan of other repos for an existing staged/untracked state was blocked by the permission classifier. This conclusion rests on the implementation plus git's documentation.
- Also: the method name promises "dirty working tree" while the summary line says "uncommitted changes"; pick one and match the git command (`git status --porcelain` non-empty covers both).

### 9. doc-mismatch - GitRepo: every doc example uses `new GitRepo(".")`, which throws

- Repro: `./dist/yavascript -e 'new GitRepo(".")'`
- Expected (from `git-repo.inc.d.ts:127, 152, 179`): a repo object for the cwd.
- Actual: `Error: Couldn't resolve absolute path to repo dir. (repoDir = ".", cwd = Path { /Users/suchipi/Code/yavascript })`. `GitRepo.findRoot(".")` and `findRoot("src")` also throw (`Could not resolve "." into an absolute path`). Rejecting relative paths is undocumented for both, and inconsistent with the rest of the API (`exists("src")`, `cd("src")`, and `isIgnored("README.md")` all accept relative paths).
- Cause: `git-repo.ts:20-25` and `:54-65`. `Path.normalize` doesn't resolve against `pwd()`.

### 10. bug - GitRepo.findRoot ignores `.git` files (submodules, `git worktree` checkouts), unlike the constructor

- Repro: `./dist/yavascript -e 'logger.info = () => {}; GitRepo.findRoot("/Users/suchipi/Code/uiohook-napi/libuiohook/src").toString()'` (`libuiohook` is an existing submodule whose `.git` is a 35-byte file)
- Expected: `/Users/suchipi/Code/uiohook-napi/libuiohook` (`git -C .../libuiohook/src rev-parse --show-toplevel` prints that).
- Actual: `/Users/suchipi/Code/uiohook-napi` (the superproject). `new GitRepo("/Users/suchipi/Code/uiohook-napi/libuiohook")` is accepted and `commitSHA()` works, so the two entry points disagree.
- Cause: `git-repo.ts:34` requires `isDir(.git)`; the constructor at `:68` only checks `exists`. The docs (`:20-23`) also say "`.git` folder".

### 11. bug - help(): pre-release versions link to a tag that doesn't exist yet

- Repro: `./dist/yavascript -e 'yavascript.version = "v1.0.0-rc.1"; help()'`
- Expected: a link to the `v1.0.0-rc.1` ref (the `yavascript.version` docs explicitly allow `v0.1.3-alpha` style versions).
- Actual: `Please see: https://github.com/suchipi/yavascript/blob/v1.0.0/meta/generated-docs/README.md`
- Cause: `src/layer1/api/help/help.ts:18` regex `^(v[0-9.]+)` drops the suffix. This matters for any 1.0 release candidate. (Existing tags are all plain `vX.Y.Z`, and the last four each have `meta/generated-docs/README.md`, checked with `git cat-file -e`.)

### 12. doc-mismatch - yavascript.compilers: bundled compiler versions are wrong in the docs

- Docs: `yavascript.inc.d.ts:59, 69, 79` say "Sucrase 3.35.0"; `:102` says "Civet 0.9.0".
- Actual: `package.json` has `"sucrase": "^3.35.1"` and `"@danielx/civet": "^0.11.14"`; `node_modules` has 3.35.1 and 0.11.14; `grep -o "3\.35\.[01]" dist/bundles/layer1.js` finds `3.35.1`. Civet 0.9 to 0.11 is a meaningful syntax jump for users reading the docs.

### 13. doc-mismatch - yavascript.compilers.esmToCjs exists but is undocumented, and its output isn't CommonJS-only

- Repro: `./dist/yavascript -e 'Object.keys(yavascript.compilers)'` gives `js, tsx, ts, jsx, coffee, civet, autodetect, esmToCjs`. `yavascript.compilers.esmToCjs("import x from 'y'; export default 1;")` (in `compilers1.js`) returns the sucrase CJS output wrapped in the interop prelude and ending in `export { __isCjsModule }; export const __cjsExports = module.exports;`.
- Expected: either documented in `yavascript.inc.d.ts` or hidden. It's snapshot-tested as present (`meta/tests/src/yavascript-api.test.ts:34`), so it is effectively public.
- Question: is the ESM `export` tail intended for a function named `esmToCjs`? (`src/layer1/compilers.ts:228-241, 300-304`.)

### 14. doc-mismatch - YAML.stringify is not "the same way that JSON.stringify does"

Docs (`yaml.inc.d.ts:15-17`) claim JSON parity. Differences:

| Input | JSON.stringify | YAML.stringify (actual) |
| --- | --- | --- |
| `YAML.stringify({a: {b: 1}}, null, "\t")` (string indent) | uses the string | `TypeError: when present, 'indent' argument must be a number` |
| indent `0`, `-1`, `1.5` | compact / clamped | silently 2 spaces: `"a:\n  b: 1\n"` |
| `{f: () => 1}` or `[() => 1]` | key omitted / `null` | `Error: Tag not resolved for Function value` (same for Symbol) |
| circular object | `TypeError` | `"&a1\na: 1\nself: *a1\n"` (anchors) |
| same object referenced twice | duplicated | `a: &a1 ... b: *a1` (anchors emitted without being asked) |

Repro: `yaml2.js` and `./dist/yavascript -e 'YAML.stringify({f: () => 1})'`.

### 15. gap - YAML multi-document input is unsupported and the error names an API that doesn't exist

- Repro: `./dist/yavascript -e 'YAML.parse("a: 1\n---\nb: 2")'`
- Actual: `YAMLParseError: Source contains multiple documents; please use YAML.parseAllDocuments() at line 2, column 1`. `Object.keys(YAML)` is `["parse","stringify"]`, so users are pointed to nothing. Multi-doc streams are routine (Kubernetes manifests, `kubectl get -o yaml` lists).
- Similar: `YAML.parse("? [a, b]\n: c")` prints `... Set mapAsMap: true to use object keys.` to stderr, but no options can be passed (`YAML.parse("a: 1", { version: "1.1" })` gives `TypeError: when present, 'reviver' argument must be a function`).

### 16. gap - YAML: merge keys ignored and YAML 1.1 scalars not recognized (schema undocumented); stringify emits unquoted 1.1 booleans

- Repro: `./dist/yavascript -e 'JSON.stringify(YAML.parse("base: &b {x: 1}\nm:\n  <<: *b\n  y: 2"))'` gives `{"base":{"x":1},"m":{"<<":{"x":1},"y":2}}` (a literal `<<` key; docker-compose and GitLab CI files depend on merge keys).
- `YAML.parse("a: yes\nb: on")` gives strings; `d: 2001-12-14` gives the string `"2001-12-14"` (YAML 1.2 core schema; nothing in the docs says which schema is used).
- `./dist/yavascript -e 'JSON.stringify(YAML.stringify({country: "no", enabled: "on"}))'` gives `"country: no\nenabled: on\n"`. A YAML 1.1 consumer (PyYAML, go-yaml v2, older Ruby) reads these as booleans ("the Norway problem").

### 17. rough-edge - YAML.parse writes warnings to stderr as raw object dumps

- Repro: `./dist/yavascript -e 'const r = YAML.parse("a: !foo bar"); console.log("result:", JSON.stringify(r))'`
- Actual: stdout gets `result: {"a":"bar"}`; stderr gets a 19-line `YAMLWarning { name: "YAMLWarning" code: "TAG_RESOLVE_FAILED" ... pos: [...] linePos: [...] }` dump. It can't be silenced through the API.
- Cause: `node_modules/yaml/dist/log.js` `warn()` falls back to `console.warn(warning)` when `process.emitWarning` is absent. `YAML.parse` passes no `logLevel`.

### 18. gap - TOML is spec 0.5.0, not 1.0.0: heterogeneous arrays are rejected

- Repro: `./dist/yavascript -e 'JSON.stringify(TOML.parse("a = [1, 2.0]"))'` and `TOML.parse('a = [1, "a", {x = 1}]')`
- Expected (TOML 1.0.0, released 2021): valid arrays.
- Actual: `TomlError: Inline lists must be a single type, not a mix of integer and float at row 1, col 13, pos 12`. `TOML.stringify({a: [1, "two"]})` throws `Array values can't have mixed types`.
- Cause: @iarna/toml's README line 7 states `TOML 0.5.0`. Neither version is stated in `toml.inc.d.ts`.

### 19. rough-edge - TOML.parse/stringify do no argument validation (YAML and CSV do)

- Repro: `./dist/yavascript -e 'JSON.stringify(TOML.parse(42))'` gives `{}`; `./dist/yavascript -e 'TOML.parse()'` gives `TypeError: cannot read property 'length' of undefined`. Compare `YAML.parse(42)` / `CSV.parse(42)`, which give `TypeError: 'input' argument must be a string`.
- Cause: `src/layer1/api/toml/toml.ts:4-9` passes straight through.

### 20. rough-edge - TOML.stringify silently drops or mangles values

- Repro: `./dist/yavascript -e 'TOML.stringify({a: [1, null], m: new Map([["k", 1]]), f() {}})'` gives `a = [ 1 ]` (null dropped, indices shift), `m = { }`, `f = { }`.
- Also (from `toml2.js`): a circular object gives `InternalError: stack overflow`; `{n: 2 ** 60}` gives `n = 1_152_921_504_606_847_000` (not the exact value; re-parses as a different bigint); numbers get digit separators (`1000000` becomes `1_000_000`, `1234.5678` becomes `1_234.5678`). These are valid TOML but surprising in diffs.

### 21. rough-edge - TOML local dates/times are Dates in UTC, and parsed objects carry hidden symbols (undocumented)

- From `toml1.js` (host TZ is UTC-6): `d = 1979-05-27` becomes a Date with `getDate() === 26` and `String(d) === "Sat May 26 1979 18:00:00 GMT-0600"`; `d = 1979-05-27T07:32:00` (local datetime) is treated as 07:32 UTC; `d = 07:32:00` gives `String(d) === "Sat Jan 01 0000 00:33:00 GMT-0659"`. They do round-trip through `TOML.stringify` and `JSON.stringify` correctly (`"1979-05-27"`, `"07:32:00.000"`).
- `Object.getOwnPropertySymbols(TOML.parse("a = 1"))` gives `Symbol(type)`, `Symbol(declared)`.
- None of this is in `toml.inc.d.ts`.

### 22. rough-edge - TOML.parse rejects a leading BOM; YAML and CSV accept it

- Repro: `./dist/yavascript -e 'JSON.stringify(TOML.parse("\uFEFFa = 1"))'` gives `TomlError: Unknown character "65279" at row 1, col 2, pos 1`. `YAML.parse("\uFEFFa: 1")` and `CSV.parse("\uFEFFa,b\nc,d")` strip it.

### 23. rough-edge - Parse errors are shaped differently across JSON/YAML/TOML/CSV

| API | Error | Position info |
| --- | --- | --- |
| `JSON.parse("{")` | `SyntaxError` | no position (`expecting property name`) |
| `YAML.parse("a: [")` | `YAMLParseError` (not a SyntaxError) | message has "line N, column M" + excerpt; `.linePos` 1-based |
| `YAML.parse("a: *nope")` | `ReferenceError: Unresolved alias ...` | none |
| `TOML.parse("a = ")` | `TomlError` (not a SyntaxError) | message "row 2, col 5" 1-based, but `.line`/`.col` are 0-based (`1`/`4`) |
| `CSV.parse('a,b\nc,d\ne,"f')` | plain `Error` | `Row 3` only (record index, not line; no column) |

For `UndetectableDelimiter` the CSV message always says `Row 1` because Papa gives no row and `csv.ts:14` does `(error.row ?? 0) + 1`. For `CSV.parse('a,b\n"x\ny",c\nd,e\nf,"g')` the message says `Row 4` while the error is on line 5. Script: `misc1.js`.

### 24. rough-edge - YAML/CSV/TOML namespace and signature inconsistencies

- `YAML` is a null-prototype object (`yaml.ts:14`), so `` `${YAML}` `` throws `failed to convert value to primitive`; `String(CSV)` and `String(TOML)` give `[object Object]`.
- `yavascript.d.ts:4444, 4480, 4507`: `declare const YAML`, `declare const CSV`, but `declare var TOML`.
- The parameter is named `input` for YAML/CSV and `data` for TOML. CSV and TOML silently ignore extra arguments (options objects, replacers).

### 25. gap - CSV has no options: no header row mapping, delimiter, empty-line skipping, or number coercion

- `CSV.parse(s, { delimiter: ";" })` is ignored (#2). There's no way to get `Array<Record<string,string>>` from a header row, which is the most common thing scripts do with CSV.
- `CSV.stringify([[1, 2]])` and `CSV.stringify([[null, "a"]])` give `TypeError: 'input' argument must be an array of arrays of strings`; callers must `.map(String)` first.
- `CSV.stringify([[""]])` and `CSV.stringify([[]])` both give `""` (lossy).
- Output uses CRLF with no trailing newline (`"a,b\r\nc,d"`); that's RFC 4180, but undocumented.
- `CSV.stringify([["=SUM(A1)", "+1", "@x"]])` emits them raw; Papa's `escapeFormulae` isn't exposed.

### 26. gap - Missing format support a 1.0 user would reach for

Checked against `yavascript.d.ts` (grep for `INI`, `dotenv`, `JSON5`, `parseAll`):
- No INI parser and no `.env` parser.
- JSON5 exists only as `std.parseExtJSON` (`yavascript.d.ts:5795`) and the `with { type: "json5" }` / `.json5` import loader. There's no `JSON5` global and no JSON5 stringify.
- No CSV import loader. `require("./people.csv")` executes the CSV as JavaScript: `ReferenceError: 'name' is not defined` (`import-csv.js`).
- No YAML multi-document API (#15).

### 27. rough-edge - compilers `expression` option: undocumented, and it breaks statements for sucrase-based languages (visible via `-e --lang ts`)

- Repro: `./dist/yavascript --lang ts -e 'const x: number = 1; console.log(x)'` gives `SyntaxError: Unexpected token (1:2)`. Same for `--lang jsx`/`civet` with statements, and `--lang ts -e 'console.log(1); console.log(2)'` gives `Unexpected token, expected "," (1:16)`. Plain `./dist/yavascript -e 'const x = 1; console.log(x)'` works, so JS and TS behave differently.
- `yavascript.compilers.ts("const x = 1", { expression: true })` gives `SyntaxError: Unexpected token (1:2)`. The column is off by one because of the injected `(`.
- Cause: `src/layer1/compilers.ts:58-74` wraps the code in parens; `src/layer5b/targets/eval.ts:11` always passes `expression: true`. `yavascript.inc.d.ts:53` etc. declare `expression?: boolean` without saying what it does.

### 28. rough-edge - Compiler error formats vary widely

From `compilers1.js`:
- Sucrase (ts/tsx/jsx): `SyntaxError: Unexpected token (1:10)`, with `.loc {line, column}`. The filename appears in the message only when `filename` is passed (`Error transforming /x/foo.ts: ...`).
- CoffeeScript: `SyntaxError: missing )` with no position in the message; the position is only in `.location` (0-based `first_line`/`first_column`).
- Civet: `ParseError: unknown:1:6 Failed to parse` followed by about 65 lines of grammar alternatives (`Expected: NonNewlineWhitespace ... ExpressionizedStatement ...`) before `Found: ":="`. It says `unknown` when no filename is given.

### 29. question - `yavascript.compilers` are live loader hooks and the `yavascript` object is mutable

- Repro: `./dist/yavascript .tmp/api-audit/formats-sandbox/compilers2.js` replaces `yavascript.compilers.ts` and then `require("./mod.ts")`. Output: `custom ts compiler called for .../mod.ts`. `yavascript.version = "hacked"` sticks (`Object.isFrozen(yavascript) === false`), and `help()` reads it.
- If overriding the compilers is intended, document it (it's a real extension point); if not, freeze the object or copy it.
- Related: passing `filename` to a public compiler registers source maps for that filename globally (`compilers.ts:244-253`), an undocumented side effect.

### 30. question - autodetect tries Civet before CoffeeScript, so CoffeeScript that is also valid Civet compiles as Civet

- Repro: `./dist/yavascript -e 'console.log(yavascript.compilers.autodetect("square = (x) -> x * x\nconsole.log square 3"))'` gives `square = function(x) { return x * x }` (Civet; no declaration). `yavascript.compilers.coffee(...)` on the same code gives `var square;\n\nsquare = function(x) {...}`. In a strict module, the undeclared assignment is a ReferenceError.
- The order is documented (`yavascript.inc.d.ts:113-119`); raising it because the two outputs have different semantics. Moot until #3 is fixed.

### 31. rough-edge - compilers don't validate arguments

- `./dist/yavascript -e 'yavascript.compilers.js(42)'` gives `42` (a non-string return from a function typed `: string`). `yavascript.compilers.ts("x", { filename: 5 })` is accepted.

### 32. rough-edge - GitRepo query methods print `exec: git ...` to stderr by default

- Repro: `./dist/yavascript -e 'new GitRepo("/Users/suchipi/Code/yavascript").isIgnored("README.md")'` prints to stderr (dim) `exec: git check-ignore "/Users/suchipi/Code/yavascript/README.md"` and `exec -> {"status":1}`, then `false`.
- The git invocations are an implementation detail (the docs mention them only as "how"), but scripts get this noise unless they globally set `logger.info = () => {}`. `git-repo.ts:84, 105, 134, 190` don't pass `logging` to `exec`.

### 33. rough-edge - GitRepo.isIgnored: `..` bypasses the outside-repo check; raw git failures surface; odd `""` handling; unbalanced quote in message

- `./dist/yavascript -e 'logger.info = () => {}; new GitRepo("/Users/suchipi/Code/yavascript").isIgnored("../outside")'` gives `Error: 'git check-ignore '/Users/suchipi/Code/yavascript/../outside' failed (status = 128, stderr = "fatal: ... is outside repository ...")`. The friendly "outside of the GitRepo object's repoDir" check at `git-repo.ts:178` is skipped because `this.repoDir.concat(pathObj)` at `:161` isn't normalized.
- `isIgnored("yavascript-internals/node_modules")` (through the repo's own symlink) gives status 128 `pathspec ... is beyond a symbolic link`.
- `isIgnored("")` gives "outside of the GitRepo object's repoDir" with `resolvedPath = "/"`, because `new Path("")` is `/` (`./dist/yavascript -e 'new Path("").toString()'` gives `/`, a Path-area issue).
- The message template at `git-repo.ts:197` has an unbalanced quote: `'git check-ignore '<path>' failed`.

### 34. rough-edge - GitRepo error messages

- `GitRepo.findRoot("/")` gives `Could not find git repo root (inputPath = /, resolvedPath = /) (inputPath = "/", resolvedPath = Path { / })`: the same info twice, since `makeErrorWithProperties` already appends it (`git-repo.ts:41-44`).
- The constructor error says `The 'repoPath' provided ...` but the parameter is `repoDir` (`git-repo.ts:70`, `git-repo.inc.d.ts:112`).
- The relative-path error `Couldn't resolve absolute path to repo dir.` doesn't say that relative paths are unsupported or suggest `pwd()`/`findRoot`.

### 35. question - GitRepo.branchName doc wording vs detached HEAD; unborn branches throw

- Docs (`git-repo.inc.d.ts:143-144`): "If the commit SHA the git repo is currently pointed at is the tip of a named branch, returns the branch name". With a detached HEAD sitting exactly on a branch tip, `git rev-parse --abbrev-ref HEAD` prints `HEAD`, so `branchName()` returns `null` (`git-repo.ts:124-125`). The docs' second note is right, but the first sentence describes something else.
- In a repo with no commits yet, `git rev-parse --abbrev-ref HEAD` fails, so `branchName()` throws even though the branch name is known (`git symbolic-ref --short HEAD` would return it).
- Reasoned from the implementation only; per the audit rules I didn't check out or init anything.

### 36. question - GitRepo.isIgnored returns false for tracked files that match .gitignore

- Docs (`git-repo.inc.d.ts:173-174`): "whether the provided path is ignored by one or more `.gitignore` files". `git check-ignore` without `--no-index` skips tracked files ("By default, tracked files are not shown at all since they are not subject to exclude rules", `man git-check-ignore`). There are no such files in this repo (`git ls-files -ci --exclude-standard` is empty), so this is reasoned from docs, not reproduced.

### 37. gap - GitRepo covers very little

The whole surface is `findRoot`, the constructor, `repoDir`, `commitSHA`, `branchName`, `isWorkingTreeDirty`, and `isIgnored`. Common script needs have no API: staged vs unstaged vs untracked, changed-file list, `isTracked`, remote URL, current tag / `git describe`, short SHA, repo root from `git rev-parse --show-toplevel` (which would also fix #10).

### 38. gap - help() takes no arguments and still points at GitHub markdown rather than the website

- `./dist/yavascript -e 'help(YAML)'` and `help("YAML")` print the same generic link (`help.length === 0`). The full `.d.ts` is embedded (`yavascript.getTypesDts()`), so offline per-symbol help like `help(YAML)` or `help("GitRepo.findRoot")` is feasible.
- `README.md:36` says "For the full API documentation, see the website (https://yavascript.suchipi.com/docs/)", but `help()` and `help.inc.d.ts:5-6` link to `github.com/.../meta/generated-docs/README.md`. This is the open item in `todo.md:1` ("no versioning on the website though"). One option: print the versioned GitHub link plus the website link when the version is a release.
- Related to that todo: `meta/website/docusaurus.config.ts:19` still has the template value `url: 'https://your-docusaurus-site.example.com'`.

### 39. rough-edge - YAML `!!binary` can't be parsed

- Repro: `./dist/yavascript -e 'YAML.parse("a: !!binary aGVsbG8=")'` gives `YAMLParseError: This environment does not support reading binary tags; either Buffer or atob is required at line 1, column 4`. `typeof atob` and `typeof Buffer` are both `"undefined"` in yavascript, so the user can't act on this message.

## Verified working

- **YAML.parse**: maps, sequences, flow collections; anchors/aliases (alias identity preserved: `r.a === r.b`); block `|` and folded `>` scalars; CRLF; BOM; `.inf`/`-.inf`/`.nan`; `~`/`null`/empty as null; `0o17`/`0x1F`; `!!str`, `!!set` (gives Set), `!!omap` (gives Map); empty or comment-only doc gives `null`; reviver (value mapping, `this` is the parent object, returning `undefined` deletes); `__proto__` key becomes an own property with no prototype pollution; duplicate keys, bad indentation, tabs and unclosed flow collections all raise `YAMLParseError` with 1-based line/column, a code excerpt, `.code` and `.linePos`; argument type errors.
- **YAML.stringify**: replacer function and array (applied at nested levels); numeric indent (4); quotes ambiguous strings (`"123"`, `"null"`, `"a: b"`, `""`, `"- x"`, `"#c"`); multiline to `|` block; Date to ISO; Map/Set/BigInt/NaN/Infinity; `toJSON` (Path gives `/a/b`); top-level `undefined` gives `undefined` like JSON; a mixed-value round-trip through `YAML.parse` is exact; argument type errors.
- **CSV.parse**: quoted commas, embedded LF and CRLF inside quotes, `""` escapes, CRLF and CR-only line endings, BOM stripped, ragged rows preserved as-is, empty fields, unicode, values stay strings; unterminated quotes are reported (`MissingQuotes`).
- **CSV.stringify**: quotes fields containing `,` `"` LF CR and leading/trailing spaces; ragged rows; a 5-column round-trip with special characters is exact; argument type validation.
- **TOML.parse**: tables, nested tables, inline tables, arrays of tables including nested `[[fruit.variety]]`, dotted and quoted keys, hex/oct/bin, `1_000_000`, `inf`/`-inf`/`nan`/`+inf`, exponent floats, basic/literal/multiline strings and escapes, nested arrays, empty doc gives `{}`, CRLF; offset datetimes become real `Date`s with correct instants; integers above 2^53 become `bigint` exactly (up to int64 max); duplicate key, redefined table, unterminated string and bare word errors carry row/col and an excerpt; `[__proto__]` table doesn't pollute.
- **TOML.stringify**: scalars, `[table]`, `[[array of tables]]`, bigint, `inf`/`nan`, Date to offset datetime (round-trips to the same `getTime()`), parsed local date/time/datetime round-trip, keys needing quotes, multiline strings, control-character escapes, `toJSON` (Path); rejects non-object top level with a clear message. Plain values are emitted before tables (key order changes, content is equivalent).
- **GitRepo.findRoot**: from the repo root, a subdirectory, a file, a nonexistent file inside the repo, a `Path`, and a path containing `..`; throws at `/` and `$HOME`; argument type error.
- **GitRepo constructor**: string, `Path`, trailing slash normalized; clear errors for a subdirectory, `$HOME`, and a nonexistent dir; `GitRepo()` without `new` throws.
- **GitRepo methods** (on this repo): `commitSHA()` gives `3eedd831a85cfc2081b04eac44c93088cce14963` (matches `git rev-parse HEAD`); `branchName()` gives `main`; `isWorkingTreeDirty()` gives `false` on the clean tree; `isIgnored` gives false for `README.md`, `.git`, and a nonexistent file, and true for `node_modules`, `dist`, `dist/`, `.tmp/foo`, and an absolute `Path`; relative paths resolve against the repo root as documented; outside-repo absolute paths and newline paths give the documented errors.
- **yavascript**: `version` is `git-3eedd831a85c` (matches the documented `git-` + 12 hex format and HEAD); `arch` is `arm64`; `ecmaVersion` is `ES2023`; `getTypesDts()` is identical to `--print-types` stdout.
- **yavascript.compilers**: ts/tsx/jsx/coffee/civet produce correct JS for valid input; TS enums and `const enum` compile; JSX uses `JSX.createElement` / `JSX.Fragment`; shebang lines are stripped for ts/coffee/civet (ts and civet keep a blank line in its place); `filename` shows up in sucrase/coffee/civet errors; autodetect falls back to the original code for garbage, as documented.
- **help()**: prints `\nPlease see: <url>\n` to stdout, returns `undefined`, no ANSI codes when piped; the sha, `vX.Y.Z` and `main` fallback branches produce the expected URLs.

## Test coverage notes

- **YAML**: no tests call `YAML.parse` or `YAML.stringify` at all (only `.yaml`/`.yml` import fixtures in `meta/tests/src/import-attributes.test.ts` and `fixture-scripts`). Errors, reviver/replacer/indent, anchors, multi-doc, and stderr warnings are untested.
- **CSV**: `meta/tests/src/csv.test.ts` has one 2x3 round-trip with no trailing newline. A single test parsing a normal file (trailing newline), a single-column file, or a blank line would have caught #1 and #2. Quoting, embedded newlines, and error messages are untested.
- **TOML**: `meta/tests/src/toml.test.ts` covers one simple parse and one simple stringify. Dates/times (#4, #21), bigints/overflow (#7), arrays of tables, and error output are untested.
- **Format file imports**: no fixture has a date, `inf`/`nan`, a big integer, or a `!!set`, so the lossy JSON round-trip in #5 is invisible.
- **GitRepo**: in `meta/tests/src/git-repo.test.ts` ("passing relative path to isIgnored resolves relative to repo root rather than pwd"), the 2nd and 3rd stdout lines start with `at ` and are collapsed into `at somewhere` by first-base's stack-trace sanitizer (`meta/tests/node_modules/first-base/dist/sanitizers.js:33`; visible in the snapshot at `git-repo.test.ts:106-107`). The key subdirectory assertions of that test aren't actually checked. `isWorkingTreeDirty` is only checked with `typeof`; the `branchName() === null` path, `findRoot` from a file path, submodules/worktrees (#10), and `GIT_DIR` (#6) are untested.
- **yavascript.compilers**: only `compilers.js` is exercised (`cjs-interop.test.ts`). No direct tests for ts/tsx/jsx/coffee/civet/autodetect/esmToCjs output or errors, the `expression` option (#27), or running/importing an extensionless file (#3; there's no extensionless script in `meta/tests/fixtures/scripts/`). `--lang` combined with an extensionless file is also untested.
- **yavascript global**: `yavascript-api.test.ts` snapshots only the object's shape, which is how the undocumented `esmToCjs` got locked in (#13).
- **help()**: no tests; the version-to-URL branches in `help.ts:15-24` (including the pre-release case in #11) are untested.
