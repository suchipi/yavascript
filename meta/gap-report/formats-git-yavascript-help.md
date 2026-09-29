# API audit: YAML, CSV, TOML, GitRepo, yavascript, help

Binary under test: `./dist/yavascript` (version `git-d8cc554c0810`, arm64). All commands were run from the repo root with `</dev/null`. Scratch scripts referenced below live in `.tmp/gap-update/formats/`.

Bundled library versions (from `node_modules/*/package.json`): yaml 2.9.0, papaparse 5.5.4, @iarna/toml 2.2.5 (with `meta/patches/@iarna+toml+2.2.5.patch` applied), sucrase 3.35.1, coffeescript 2.7.0, @danielx/civet 0.11.14.

## Findings

### 1. rough-edge - TOML.parse: integers come back as `number` or `bigint` depending on their value (undocumented)

- Repro: `./dist/yavascript -e 'const r = TOML.parse("a = 42\nb = 9007199254740993"); [typeof r.a, typeof r.b]'`
- Actual: `number` and `bigint`. Integers are `number` when safe and `bigint` otherwise, so the type of a field depends on its value. `toml.inc.d.ts` says nothing about it.

### 2. doc-mismatch - GitRepo: every doc example uses `new GitRepo(".")`, which throws

- Repro: `./dist/yavascript -e 'new GitRepo(".")'`
- Expected (from `git-repo.inc.d.ts:127, 152, 181`): a repo object for the cwd.
- Actual: `Error: Couldn't resolve absolute path to repo dir. (repoDir = ".", cwd = Path { /Users/suchipi/Code/yavascript })`. `GitRepo.findRoot(".")` and `findRoot("src")` also throw (`Could not resolve "." into an absolute path`). The docs for neither say that relative paths are rejected.
- Cause: `git-repo.ts:36-41` and `:70-81`.

### 3. doc-mismatch - yavascript.compilers: bundled compiler versions are wrong in the docs

- Docs: `yavascript.inc.d.ts:59, 69, 79` say "Sucrase 3.35.0"; `:102` says "Civet 0.9.0".
- Actual: `package.json` has `"sucrase": "^3.35.1"` and `"@danielx/civet": "^0.11.14"`; `node_modules` has 3.35.1 and 0.11.14; `grep -o "3\.35\.[01]" dist/bundles/layer1.js` finds `3.35.1`. Civet 0.9 to 0.11 is a meaningful syntax jump for users reading the docs.

### 4. doc-mismatch - yavascript.compilers.esmToCjs exists but is undocumented, and its output isn't CommonJS-only

- Repro: `./dist/yavascript -e 'Object.keys(yavascript.compilers)'` gives `js, tsx, ts, jsx, coffee, civet, autodetect, esmToCjs`. `yavascript.compilers.esmToCjs("import x from 'y'; export default 1;")` returns the sucrase CJS output wrapped in the interop prelude and ending in `export { __isCjsModule }; export const __cjsExports = module.exports; export default module.exports;`.
- Expected: either documented in `yavascript.inc.d.ts` or hidden. It's snapshot-tested as present (`meta/tests/src/yavascript-api.test.ts:34`), so it is effectively public.
- Question: is the ESM `export` tail intended for a function named `esmToCjs`? (`src/layer1/compilers.ts:228-241, 300-304`.)

### 5. doc-mismatch - YAML.stringify is not "the same way that JSON.stringify does"

Docs (`yaml.inc.d.ts:15-17`) claim JSON parity. Differences:

| Input | JSON.stringify | YAML.stringify (actual) |
| --- | --- | --- |
| `YAML.stringify({a: {b: 1}}, null, "\t")` (string indent) | uses the string | `TypeError: when present, 'indent' argument must be a number` |
| indent `0`, `-1`, `1.5` | compact / clamped | silently 2 spaces: `"a:\n  b: 1\n"` |
| `{f: () => 1}` or `[() => 1]` | key omitted / `null` | `Error: Tag not resolved for Function value` (same for Symbol) |
| circular object | `TypeError` | `"&a1\na: 1\nself: *a1\n"` (anchors) |
| same object referenced twice | duplicated | `a: &a1 ... b: *a1` (anchors emitted without being asked) |

Repro: `./dist/yavascript -e 'YAML.stringify({f: () => 1})'`; the other rows are the table's inputs passed the same way.

### 6. gap - YAML multi-document input is unsupported and the error names an API that doesn't exist

- Repro: `./dist/yavascript -e 'YAML.parse("a: 1\n---\nb: 2")'`
- Actual: `YAMLParseError: Source contains multiple documents; please use YAML.parseAllDocuments() at line 2, column 1`. `Object.keys(YAML)` is `["parse","stringify"]`, so users are pointed to nothing. Multi-doc streams are routine (Kubernetes manifests, `kubectl get -o yaml` lists).
- Similar: `YAML.parse("? [a, b]\n: c")` prints `... Set mapAsMap: true to use object keys.` to stderr, but no options can be passed (`YAML.parse("a: 1", { version: "1.1" })` gives `TypeError: when present, 'reviver' argument must be a function`).

### 7. gap - YAML: merge keys ignored and YAML 1.1 scalars not recognized (schema undocumented); stringify emits unquoted 1.1 booleans

- Repro: `./dist/yavascript -e 'JSON.stringify(YAML.parse("base: &b {x: 1}\nm:\n  <<: *b\n  y: 2"))'` gives `{"base":{"x":1},"m":{"<<":{"x":1},"y":2}}` (a literal `<<` key; docker-compose and GitLab CI files depend on merge keys).
- `YAML.parse("a: yes\nb: on")` gives strings; `d: 2001-12-14` gives the string `"2001-12-14"` (YAML 1.2 core schema; nothing in the docs says which schema is used).
- `./dist/yavascript -e 'JSON.stringify(YAML.stringify({country: "no", enabled: "on"}))'` gives `"country: no\nenabled: on\n"`. A YAML 1.1 consumer (PyYAML, go-yaml v2, older Ruby) reads these as booleans ("the Norway problem").

### 8. rough-edge - YAML.parse writes warnings to stderr as raw object dumps

- Repro: `./dist/yavascript -e 'const r = YAML.parse("a: !foo bar"); console.log("result:", JSON.stringify(r))'`
- Actual: stdout gets `result: {"a":"bar"}`; stderr gets a 19-line `YAMLWarning { name: "YAMLWarning" code: "TAG_RESOLVE_FAILED" ... pos: [...] linePos: [...] }` dump. It can't be silenced through the API.
- Cause: `node_modules/yaml/dist/log.js` `warn()` falls back to `console.warn(warning)` when `process.emitWarning` is absent. `YAML.parse` passes no `logLevel`.

### 9. gap - TOML is spec 0.5.0, not 1.0.0: heterogeneous arrays are rejected

- Repro: `./dist/yavascript -e 'JSON.stringify(TOML.parse("a = [1, 2.0]"))'` and `TOML.parse('a = [1, "a", {x = 1}]')`
- Expected (TOML 1.0.0, released 2021): valid arrays.
- Actual: `TomlError: Inline lists must be a single type, not a mix of integer and float at row 1, col 13, pos 12`. `TOML.stringify({a: [1, "two"]})` throws `Array values can't have mixed types`.
- Cause: @iarna/toml's README line 7 states `TOML 0.5.0`. Neither version is stated in `toml.inc.d.ts`.

### 10. rough-edge - TOML.parse/stringify do no argument validation (YAML and CSV do)

- Repro: `./dist/yavascript -e 'JSON.stringify(TOML.parse(42))'` gives `{}`; `./dist/yavascript -e 'TOML.parse()'` gives `TypeError: cannot read property 'length' of undefined`. Compare `YAML.parse(42)` / `CSV.parse(42)`, which give `TypeError: 'input' argument must be a string`.
- Cause: `src/layer1/api/toml/toml.ts:4-9` passes straight through.

### 11. rough-edge - TOML.stringify silently drops or mangles values

- Repro: `./dist/yavascript -e 'TOML.stringify({a: [1, null], m: new Map([["k", 1]]), f() {}})'` gives `a = [ 1 ]` (null dropped, indices shift), `m = { }`, `f = { }`.
- Also: a circular object (`const o = {a: 1}; o.self = o; TOML.stringify(o)`) runs for about 12 seconds and then throws `InternalError: stack overflow` with a stack trace over 7,000 lines long; `{n: 2 ** 60}` gives `n = 1_152_921_504_606_847_000` (not the exact value; re-parses as a different bigint); numbers get digit separators (`1000000` becomes `1_000_000`, `1234.5678` becomes `1_234.5678`). These are valid TOML but surprising in diffs.

### 12. rough-edge - TOML local dates/times are Dates in UTC, and parsed objects carry hidden symbols (undocumented)

- From `toml-dates.js` (host TZ is UTC-6): `d = 1979-05-27` becomes a Date with `getDate() === 26` and `String(d) === "Sat May 26 1979 18:00:00 GMT-0600"`; `d = 1979-05-27T07:32:00` (local datetime) is treated as 07:32 UTC; `d = 07:32:00` gives `String(d) === "Sat Jan 01 0000 00:33:00 GMT-0659"`. They do round-trip through `TOML.stringify` and `JSON.stringify` correctly (`"1979-05-27"`, `"07:32:00.000"`).
- `Object.getOwnPropertySymbols(TOML.parse("a = 1"))` gives `Symbol(type)`, `Symbol(declared)`.
- None of this is in `toml.inc.d.ts`.

### 13. rough-edge - TOML.parse rejects a leading BOM; YAML and CSV accept it

- Repro: `./dist/yavascript -e 'JSON.stringify(TOML.parse("\uFEFFa = 1"))'` gives `TomlError: Unknown character "65279" at row 1, col 2, pos 1`. `YAML.parse("\uFEFFa: 1")` and `CSV.parse("\uFEFFa,b\nc,d")` strip it.

### 14. rough-edge - Parse errors are shaped differently across JSON/YAML/TOML/CSV

| API | Error | Position info |
| --- | --- | --- |
| `JSON.parse("{")` | `SyntaxError` | no position (`expecting property name`) |
| `YAML.parse("a: [")` | `YAMLParseError` (not a SyntaxError) | message has "line N, column M" + excerpt; `.linePos` 1-based |
| `YAML.parse("a: *nope")` | `ReferenceError: Unresolved alias ...` | none |
| `TOML.parse("a = ")` | `TomlError` (not a SyntaxError) | message "row 1, col 6" 1-based, but `.line`/`.col` are 0-based (`0`/`5`) |
| `CSV.parse('a,b\nc,d\ne,"f')` | plain `Error` | `Row 3` only (record index, not line; no column) |

For `CSV.parse('a,b\n"x\ny",c\nd,e\nf,"g')` the message says `Row 4` while the error is on line 5. Script: `parse-errors.js`.

### 15. rough-edge - YAML/CSV/TOML namespace and signature inconsistencies

- `YAML` is a null-prototype object (`yaml.ts:14`), so `` `${YAML}` `` throws `failed to convert value to primitive`; `String(CSV)` and `String(TOML)` give `[object Object]`.
- `yavascript.d.ts:4452, 4488, 4515`: `declare const YAML`, `declare const CSV`, but `declare var TOML`.
- The parameter is named `input` for YAML/CSV and `data` for TOML. CSV and TOML silently ignore extra arguments (options objects, replacers).

### 16. gap - CSV has no options: no header row mapping, delimiter, empty-line skipping, or number coercion

- `CSV.parse(s, { delimiter: ";" })` is ignored; parsing always splits on `,`. There's no way to get `Array<Record<string,string>>` from a header row, which is the most common thing scripts do with CSV.
- `CSV.stringify([[1, 2]])` and `CSV.stringify([[null, "a"]])` give `TypeError: 'input' argument must be an array of arrays of strings`; callers must `.map(String)` first.
- `CSV.stringify([[""]])` and `CSV.stringify([[]])` both give `""` (lossy).
- Output uses CRLF with no trailing newline (`"a,b\r\nc,d"`); that's RFC 4180, but undocumented.
- `CSV.stringify([["=SUM(A1)", "+1", "@x"]])` emits them raw; Papa's `escapeFormulae` isn't exposed.

### 17. gap - Missing format support a 1.0 user would reach for

Checked against `yavascript.d.ts` (grep for `INI`, `dotenv`, `JSON5`, `parseAll`):
- No INI parser and no `.env` parser.
- JSON5 exists only as `std.parseExtJSON` (`yavascript.d.ts:5802`) and the `with { type: "json5" }` / `.json5` import loader. There's no `JSON5` global and no JSON5 stringify.
- No CSV import loader. `require("./people.csv")` executes the CSV as JavaScript: `ReferenceError: 'name' is not defined`.
- No YAML multi-document API (#6).

### 18. rough-edge - compilers `expression` option: undocumented, and it breaks statements for sucrase-based languages (visible via `-e --lang ts`)

- Repro: `./dist/yavascript --lang ts -e 'const x: number = 1; console.log(x)'` gives `SyntaxError: Unexpected token (1:2)`. Same for `--lang jsx`/`civet` with statements, and `--lang ts -e 'console.log(1); console.log(2)'` gives `Unexpected token, expected "," (1:16)`. Plain `./dist/yavascript -e 'const x = 1; console.log(x)'` works, so JS and TS behave differently.
- `yavascript.compilers.ts("const x = 1", { expression: true })` gives `SyntaxError: Unexpected token (1:2)`. The column is off by one because of the injected `(`.
- Cause: `src/layer1/compilers.ts:58-74` wraps the code in parens; `src/layer5b/targets/eval.ts:11` always passes `expression: true`. `yavascript.inc.d.ts:53` etc. declare `expression?: boolean` without saying what it does.

### 19. rough-edge - Compiler error formats vary widely

From `compiler-errors.js`:
- Sucrase (ts/tsx/jsx): `SyntaxError: Unexpected token (1:11)`, with `.loc {line, column}`. The filename appears in the message only when `filename` is passed (`Error transforming /x/foo.ts: ...`).
- CoffeeScript: `SyntaxError: missing )` with no position in the message; the position is only in `.location` (0-based `first_line`/`first_column`).
- Civet: `ParseError: unknown:1:6 Failed to parse` followed by about 65 lines of grammar alternatives (`Expected: NonNewlineWhitespace ... ExpressionizedStatement ...`) before `Found: ":="`. It says `unknown` when no filename is given.

### 20. question - `yavascript.compilers` are live loader hooks and the `yavascript` object is mutable

- Repro: `./dist/yavascript .tmp/gap-update/formats/compilers-override.js` replaces `yavascript.compilers.ts` and then `require("./mod.ts")`. Output: `custom ts compiler called for .../mod.ts`. `yavascript.version = "hacked"` sticks (`Object.isFrozen(yavascript) === false`), and `help()` reads it.
- If overriding the compilers is intended, document it (it's a real extension point); if not, freeze the object or copy it.
- Related: passing `filename` to a public compiler registers source maps for that filename globally (`compilers.ts:244-253`), an undocumented side effect.

### 21. question - autodetect tries Civet before CoffeeScript, so CoffeeScript that is also valid Civet compiles as Civet

- Repro: `./dist/yavascript -e 'console.log(yavascript.compilers.autodetect("square = (x) -> x * x\nconsole.log square 3"))'` gives `square = function(x) { return x * x }` (Civet; no declaration). `yavascript.compilers.coffee(...)` on the same code gives `var square;\n\nsquare = function(x) {...}`.
- In a strict module, the undeclared assignment is a ReferenceError: running an extensionless file holding that code (`./dist/yavascript .tmp/gap-update/formats/a.b/ambig`) gives `ReferenceError: 'square' is not defined`, while `--lang coffee` on the same file prints `9`.
- The order is documented (`yavascript.inc.d.ts:113-119`); raising it because the two outputs have different semantics.

### 22. rough-edge - compilers don't validate arguments

- `./dist/yavascript -e 'yavascript.compilers.js(42)'` gives `42` (a non-string return from a function typed `: string`). `yavascript.compilers.ts("x", { filename: 5 })` is accepted.

### 23. rough-edge - GitRepo query methods print `exec: git ...` to stderr by default

- Repro: `./dist/yavascript -e 'new GitRepo("/Users/suchipi/Code/yavascript").isIgnored("README.md")'` prints to stderr (dim when stderr is a terminal) `exec: git check-ignore "/Users/suchipi/Code/yavascript/README.md"` and `exec -> {"status":1}`, then `false`.
- The git invocations are an implementation detail (the docs mention them only as "how"), but scripts get this noise unless they globally set `logger.info = () => {}`. `git-repo.ts:100, 122, 152, 209` don't pass `logging` to `exec`.

### 24. rough-edge - GitRepo.isIgnored: `..` bypasses the outside-repo check; raw git failures surface; unbalanced quote in message

- `./dist/yavascript -e 'logger.info = () => {}; new GitRepo("/Users/suchipi/Code/yavascript").isIgnored("../outside")'` gives `Error: 'git check-ignore '/Users/suchipi/Code/yavascript/../outside' failed (status = 128, stderr = "fatal: ... is outside repository ...")`. The friendly "outside of the GitRepo object's repoDir" check at `git-repo.ts:197` is skipped because `this.repoDir.concat(pathObj)` at `:180` isn't normalized.
- `isIgnored("yavascript-internals/node_modules")` (through the repo's own symlink) gives status 128 `pathspec ... is beyond a symbolic link`.
- The message template at `git-repo.ts:217` has an unbalanced quote: `'git check-ignore '<path>' failed`.

### 25. rough-edge - GitRepo error messages

- `GitRepo.findRoot("/")` gives `Could not find git repo root (inputPath = /, resolvedPath = /) (inputPath = "/", resolvedPath = Path { / })`: the same info twice, since `makeErrorWithProperties` already appends it (`git-repo.ts:57-60`).
- The constructor error says `The 'repoPath' provided ...` but the parameter is `repoDir` (`git-repo.ts:86`, `git-repo.inc.d.ts:112`).
- The relative-path error `Couldn't resolve absolute path to repo dir.` doesn't say that relative paths are unsupported or suggest `pwd()`/`findRoot`.

### 26. question - GitRepo.branchName doc wording vs detached HEAD; unborn branches throw

- Docs (`git-repo.inc.d.ts:143-144`): "If the commit SHA the git repo is currently pointed at is the tip of a named branch, returns the branch name". With a detached HEAD sitting exactly on a branch tip (`git checkout --detach trunk` in a throwaway repo), `git rev-parse --abbrev-ref HEAD` prints `HEAD`, so `branchName()` returns `null` (`git-repo.ts:141-146`). The docs' second note is right, but the first sentence describes something else.
- In a throwaway repo with no commits yet, `branchName()` throws `'git rev-parse --abbrev-ref HEAD' failed (status = 128, stderr = "fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree. ...")` even though the branch name is known (`git symbolic-ref --short HEAD` prints `trunk`).

### 27. question - GitRepo.isIgnored returns false for tracked files that match .gitignore

- Docs (`git-repo.inc.d.ts:175-176`): "whether the provided path is ignored by one or more `.gitignore` files". `git check-ignore` without `--no-index` skips tracked files ("By default, tracked files are not shown at all since they are not subject to exclude rules", `man git-check-ignore`).
- Repro (throwaway repo whose `.gitignore` has `*.log`, with `tracked.log` committed and `untracked.log` not): `isIgnored("tracked.log")` gives `false` and `isIgnored("untracked.log")` gives `true`, while `git check-ignore --no-index tracked.log` matches.

### 28. gap - GitRepo covers very little

The whole surface is `findRoot`, the constructor, `repoDir`, `commitSHA`, `branchName`, `isWorkingTreeDirty`, and `isIgnored`. Common script needs have no API: staged vs unstaged vs untracked, changed-file list, `isTracked`, remote URL, current tag / `git describe`, short SHA, repo root from `git rev-parse --show-toplevel`.

### 29. gap - help() takes no arguments and still points at GitHub markdown rather than the website

- `./dist/yavascript -e 'help(YAML)'` and `help("YAML")` print the same generic link (`help.length === 0`). The full `.d.ts` is embedded (`yavascript.getTypesDts()`), so offline per-symbol help like `help(YAML)` or `help("GitRepo.findRoot")` is feasible.
- `README.md:36` says "For the full API documentation, see the website (https://yavascript.suchipi.com/docs/)", but `help()` and `help.inc.d.ts:5-6` link to `github.com/.../meta/generated-docs/README.md`. This is the open item in `todo.md:1` ("no versioning on the website though"). One option: print the versioned GitHub link plus the website link when the version is a release.
- Related to that todo: `meta/website/docusaurus.config.ts:19` still has the template value `url: 'https://your-docusaurus-site.example.com'`.

### 30. rough-edge - YAML `!!binary` can't be parsed

- Repro: `./dist/yavascript -e 'YAML.parse("a: !!binary aGVsbG8=")'` gives `YAMLParseError: This environment does not support reading binary tags; either Buffer or atob is required at line 1, column 4`. `typeof atob` and `typeof Buffer` are both `"undefined"` in yavascript, so the user can't act on this message.

## Verified working

- **YAML.parse**: maps, sequences, flow collections; anchors/aliases (alias identity preserved: `r.a === r.b`); block `|` and folded `>` scalars; CRLF; BOM; `.inf`/`-.inf`/`.nan`; `~`/`null`/empty as null; `0o17`/`0x1F`; `!!str`, `!!set` (gives Set), `!!omap` (gives Map); empty or comment-only doc gives `null`; reviver (value mapping, `this` is the parent object, returning `undefined` deletes); `__proto__` key becomes an own property with no prototype pollution; duplicate keys, bad indentation, tabs and unclosed flow collections all raise `YAMLParseError` with 1-based line/column, a code excerpt, `.code` and `.linePos`; argument type errors.
- **YAML.stringify**: replacer function and array (applied at nested levels); numeric indent (4); quotes ambiguous strings (`"123"`, `"null"`, `"a: b"`, `""`, `"- x"`, `"#c"`); multiline to `|` block; Date to ISO; Map/Set/BigInt/NaN/Infinity; `toJSON` (Path gives `/a/b`); top-level `undefined` gives `undefined` like JSON; a mixed-value round-trip through `YAML.parse` is exact; argument type errors.
- **CSV.parse**: always splits on `,`; a trailing newline, single-column data, blank lines and empty input all parse; quoted commas, embedded LF and CRLF inside quotes, `""` escapes, CRLF and CR-only line endings, BOM stripped, ragged rows preserved as-is, empty fields, unicode, values stay strings; unterminated quotes are reported (`MissingQuotes`).
- **CSV.stringify**: quotes fields containing `,` `"` LF CR and leading/trailing spaces; ragged rows; a 5-column round-trip with special characters is exact; argument type validation.
- **TOML.parse**: tables, nested tables, inline tables, arrays of tables including nested `[[fruit.variety]]`, dotted and quoted keys, hex/oct/bin, `1_000_000`, `inf`/`-inf`/`nan`/`+inf`, exponent floats, basic/literal/multiline strings and escapes, nested arrays, empty doc gives `{}`, CRLF; local times followed by another line; offset datetimes become real `Date`s with correct instants; integers above 2^53 become `bigint` exactly (up to int64 max), and integers outside int64 throw; duplicate key, redefined table, unterminated string and bare word errors carry row/col and an excerpt; `[__proto__]` table doesn't pollute.
- **TOML.stringify**: scalars, `[table]`, `[[array of tables]]`, bigint, `inf`/`nan`, Date to offset datetime (round-trips to the same `getTime()`), parsed local date/time/datetime round-trip, keys needing quotes, multiline strings, control-character escapes, `toJSON` (Path); rejects non-object top level with a clear message. Plain values are emitted before tables (key order changes, content is equivalent).
- **`.toml`/`.yaml` imports**: Dates, `inf`/`nan`, Sets, Maps and bigints survive both `require` and `import()`.
- **Extensionless scripts**: compile under dotted ancestor directories (`a.b/`, `v1.2/`, `node_modules/.bin/`, `.tmp/`), with and without `--lang`, and through `require`/`import`.
- **GitRepo.findRoot**: from the repo root, a subdirectory, a file, a nonexistent file inside the repo, a `Path`, and a path containing `..`; finds worktree checkouts whose `.git` is a file; ignores an inherited `GIT_DIR`; throws at `/` and `$HOME`; argument type error.
- **GitRepo constructor**: string, `Path`, trailing slash normalized; clear errors for a subdirectory, `$HOME`, and a nonexistent dir; `GitRepo()` without `new` throws.
- **GitRepo methods** (on this repo): `commitSHA()` gives `d8cc554c08109752abe8574bca2fb369f7ebe7c9` (matches `git rev-parse HEAD`); `branchName()` gives `main`; `isWorkingTreeDirty()` gives `false` on a clean tree; `isIgnored` gives false for `README.md`, `.git`, and a nonexistent file, and true for `node_modules`, `dist`, `dist/`, `.tmp/foo`, and an absolute `Path`; relative paths resolve against the repo root as documented; outside-repo absolute paths and newline paths give the documented errors.
- **yavascript**: `version` is `git-d8cc554c0810` (matches the documented `git-` + 12 hex format and HEAD); `arch` is `arm64`; `ecmaVersion` is `ES2023`; `getTypesDts()` is identical to `--print-types` stdout.
- **yavascript.compilers**: ts/tsx/jsx/coffee/civet produce correct JS for valid input; TS enums and `const enum` compile; JSX uses `JSX.createElement` / `JSX.Fragment`; shebang lines are stripped for ts/coffee/civet (ts and civet keep a blank line in its place); `filename` shows up in sucrase/coffee/civet errors; autodetect falls back to the original code for garbage, as documented.
- **help()**: prints `\nPlease see: <url>\n` to stdout, returns `undefined`, no ANSI codes when piped; the sha, `vX.Y.Z`, pre-release `vX.Y.Z-suffix` and `main` fallback branches produce the expected URLs.

## Test coverage notes

- **YAML**: `YAML.parse` is only called as the comparison baseline in `meta/tests/src/format-imports.test.ts`, and no test calls `YAML.stringify`. Errors, reviver/replacer/indent, anchors, multi-doc, and stderr warnings are untested.
- **CSV**: `meta/tests/src/csv.test.ts` covers trailing newlines, single-column and empty input, blank lines, and comma-only splitting, but no field in any of its tests needs quoting. Quoting, embedded newlines, and error messages are untested.
- **TOML**: `meta/tests/src/toml.test.ts` covers one simple parse and one simple stringify, local times followed by another line or inside an array, and that an out-of-range integer throws (not what the error says). Local date/time semantics (#12), arrays of tables, and error output are untested.
- **GitRepo**: in `meta/tests/src/git-repo.test.ts`, the `branchName() === null` path and `findRoot` from a file path are untested.
- **yavascript.compilers**: only `compilers.js` is exercised directly (`cjs-interop.test.ts`). No direct tests for ts/tsx/jsx/coffee/civet/autodetect/esmToCjs output or errors, or for the `expression` option (#18); `eval.test.ts` runs `-e` with `--lang` only on single expressions, never on statements.
- **yavascript global**: `yavascript-api.test.ts` snapshots only the object's shape, which is how the undocumented `esmToCjs` got locked in (#4).
- **help()**: `meta/tests/src/help.test.ts` covers only pre-release `vX.Y.Z-suffix` versions; the git-SHA and `main` fallback branches in `help.ts:16-25` are untested.
