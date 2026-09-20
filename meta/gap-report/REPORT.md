# YavaScript 1.0 API audit

Binary: `dist/yavascript` rebuilt from `3eedd83` (the checked-in build was older than `src/layer1/api/glob/glob.ts`). Every documented API was exercised by hand against that binary, split across 8 areas. Each area has its own detailed report next to this file, with an exact repro and actual output for every finding.

| Area | Report | Findings |
| --- | --- | --- |
| Filesystem, `Path`, `__filename`/`__dirname` | [fs.md](fs.md) | 36 |
| Shell-style commands and "did you mean" stubs | [commands.md](commands.md) | 33 |
| `exec`/`$`/`ChildProcess`, `glob`, `env`, `parseScriptArgs`, `openUrl` | [exec-glob-env-args.md](exec-glob-env-args.md) | 45 |
| `types`, `is`, `assert`, `number`/`string`/..., JSX | [types-is-assert-jsx.md](types-is-assert-jsx.md) | 25 |
| `console`, `inspect`, colors, grep, `logger`, `RegExp.escape`, `String.dedent`, `Promise.map` | [console-strings-grep-logger.md](console-strings-grep-logger.md) | 28 |
| YAML, CSV, TOML, `GitRepo`, `yavascript`, `help` | [formats-git-yavascript-help.md](formats-git-yavascript-help.md) | 39 |
| d.ts vs runtime, QuickJS `std`/`os`, doc quality, built-ins | [crosscut.md](crosscut.md) | 30 |
| Worker, `Context`, REPL, Node compat, modules, languages, CLI | [runtime-modules-cli.md](runtime-modules-cli.md) | 34 |

The existing test suite passes (563 passed, 1 skipped; log in [full-test-run.log](full-test-run.log)). None of the bugs below are covered by it.

Items marked **(re-verified)** I reproduced a second time myself, independently of the area agent.

## 1. Must fix before 1.0

### Data loss or unsafe results

| API | Problem | Cause | Ref |
| --- | --- | --- | --- |
| `remove` | Follows a symlink to a directory and empties the target. `remove("link")` wiped `victim/important.txt`. Links inside a tree being removed do the same. **(re-verified)** | `remove.ts:22` uses `isDir`, which follows links | fs #1 |
| `remove(".")` | Deletes everything in cwd, then throws. `rm -rf .` refuses up front. | `remove.ts:22-33` | fs #15 |
| `copy` `whenTargetExists: "overwrite"` | Doesn't truncate, so a longer target keeps its tail: `"SRC\n target is much longer than src\n"`. **(re-verified)** | no `O_TRUNC` at `copy.ts:58` | fs #2 |
| `copy` file into dir | Ignores `whenTargetExists` (default `"error"`) and silently overwrites `dir/<name>`, with the same corruption | `copy.ts:188-195` | fs #3 |
| `copy` dirs | Follows dir symlinks (a link to a parent copies forever until ENAMETOOLONG). Copying a dir into itself runs away. Re-copying into an existing tree nests `sub/sub`. Dir modes are not preserved (700 becomes 755). | `copy.ts`, `_getPathInfo.ts` | fs #10-12, #16 |
| `chmod("remove", ...)` | XORs instead of clearing. Removing `go-w` from 664 gave 646 (world-writable). **(re-verified)** | `chmod.ts:213-216` (`^=`) | commands #1 |
| `chmod` `{go: ...}` | Targets user+group. `add {go: "x"}` on 644 gave 754, real chmod gives 655. **(re-verified)** | `chmod.ts:82-86` | commands #2 |
| `chmod("0o755", f)` | Sets mode 000. `parseInt` accepts any octal prefix, so `"789"` gives 007. **(re-verified)** | `chmod.ts:297-305` | commands #3 |
| Empty `Path` means `/` | `dirname("a.txt")`, `new Path("")`, and `new Path("a").dirname()` all stringify as `/`, so `ls(dirname("a.txt"))` lists root and `new Path("", "etc")` is `/etc`. `Path.normalize("a/..")` is `/`. **(re-verified)** | nice-path `index.js:236-237`, `277-279`, `137-144` | fs #7-8, commands #4 |
| `rename` | Normalizes paths lexically before calling the OS, so `rename("L/../x.txt")` moved a different file than `readFile` reads at that path. `rename("")` targets `/`. | `rename.ts:20-21` | fs #9 |

### Hangs and crashes

| API | Problem | Cause | Ref |
| --- | --- | --- | --- |
| `Path#relativeTo` | Infinite loop when the path equals `dir`. **(re-verified)** | nice-path `index.js:214-217` | fs #4 |
| `Path#replaceAll` | Infinite loop with an empty replacement. Wrong output when the replacement is longer than the match. | nice-path `index.js:386-402` | fs #5-6 |
| `sleep` | `sleep()`, `sleep(undefined)`, `sleep(NaN)`, `sleep("1s")` block forever. `sleep.async` resolves immediately for the same inputs. **(re-verified)** | no validation, `Atomics.wait` with NaN, `sleep.ts:3-10` | commands #5 |
| `os.readdir` error path (hits `ls`, `glob`) | A caught readdir error makes the process abort at exit with code 134 (`JS_FreeRuntime` assertion). `glob("**")` over a tree with one unreadable dir does this even though glob itself swallows the error. **(re-verified)** | leaked array in `js_os_readdir`, `quickjs-os.c:692-705` in the QuickJS fork | exec F2, commands #6 |
| `glob` `followSymlinks: true` | No cycle detection. A `loop -> .` link yields 256 results and dozens of errors. | `glob.ts:208-209, 274-276` | exec F16 |
| `console.log` | Throws and leaves partial output when both inspect and `String(value)` fail (revoked Proxy) | `make-inspect-log.ts:46-55` | console #8 |
| REPL, `InteractivePrompt` | Spin at 100% CPU forever once stdin hits EOF, so `yavascript </dev/null` or bare `yavascript` in CI never exits. **(re-verified)** | `os.read` returning 0 is ignored, `repl-engine.ts:207-217` | runtime #2 |
| `runInWorker` | Never settles when the function throws synchronously, rejects with an Error, or returns something that can't be cloned. The script then skips everything after the `await` and exits 0. **(re-verified)** | `runInWorker.ts:22-24`, no `onerror`; Errors can't be cloned | runtime #1 |
| Exit codes | An uncaught exception in a timer callback or a main-side Worker message handler prints but exits 0, so CI reports success. An unsettled top-level `await` also exits 0. **(re-verified for timers)** | event loop | runtime #4, #34 |
| `new Context({ date: false })` / `{ promise: false }` | Throws, and even when caught the process aborts at exit with code 134 | layer 1 bytecode needs `Date`/`Promise`, `context.ts:21-36` | runtime #5 |
| `Worker.terminate()` | Doesn't stop the thread; a busy worker keeps the process alive forever. There's no way to cancel a worker or a `runInWorker` call. | | runtime #17 |
| REPL `\load`, `InteractivePrompt` `handleInput` | A throw wedges the prompt: no new prompt, and the next line is glued onto the failed one | `js-repl.ts:83-89`, `repl-engine.ts:843-846` | runtime #13-14 |

### Silently wrong results on common paths

| API | Problem | Cause | Ref |
| --- | --- | --- | --- |
| stdout buffering | When stdout is a pipe or file, output is reordered: `console.log(1); exec("echo 2"); console.log(3)` gives `2 1 3`. Also reordered against `console.error` and uncaught-error output. This affects every script run in CI or with `> log`. **(re-verified)** | nothing flushes `std.out`, `ChildProcess.ts:150-160`, `make-inspect-log.ts:62-67` | console #1, exec F1 |
| `CSV.parse` | Throws `UndetectableDelimiter` on a normal 2-column file with a trailing newline, single-column data, blank lines, or `""`. Other files get a junk `[""]` row. It also guesses the delimiter, so `a;b` is split in two, and options are ignored. **(re-verified)** | no fixed delimiter, soft warning treated as fatal, `csv.ts:9-29` | formats #1-2 |
| `is(x, Error)` / `assert.type(x, Error)` | Accepts every value (`is` returns a new Error object). Same for all Error subclasses. **(re-verified)** | pheno `coerce.js:186-192` | types #1 |
| `is`/`assert.type` with `Promise`, `WeakMap`, `WeakSet`, BigInt typed arrays, and yavascript's own `ChildProcess`, `GitRepo`, `InteractivePrompt`, `Worker`, `Context` | Throws "must be called with new" instead of doing an instanceof check. A validator whose source mentions `class ` is silently treated as a class. **(re-verified for Promise)** | pheno detects classes with `/class\s/` on the source text; only `Path` has the override (`path.ts:191-209`) | types #2-3 |
| `Array.prototype.grep`, `String.prototype.grep`, `String.dedent`, `Promise.map` | Enumerable, so `for (k in [1])` yields `"grep"`. Breaks any library that uses `for...in` on arrays. **(re-verified)** | plain assignment at `grep.ts:85,94`, `string-dedent.ts:5`, `promise-map.ts:16` | console #2, crosscut #1 |
| `RegExp.escape` | Overwrites the engine's native, spec-compliant version with an old polyfill that doesn't escape `-` and others, so `RegExp.escape("a-c")` inside `[...]` becomes a range. **(re-verified)** | `regexp-escape.ts:2-8` | console #3, crosscut #2 |
| Extensionless scripts | Never compiled, even with `--lang`, which is the exact form `--help` shows. A TS shebang script with no extension fails with a syntax error. **(re-verified)** | the `compilers[""]` key is now read as an import-attribute type, `empty.ts:4`, `run-file.ts:14-20` | formats #3 |
| CLI `script.js -e x` | Runs `x` instead of the script, so user scripts can't take a `-e` flag. **(re-verified)** | `determine-target.ts:126-134` | exec F3 |
| `parseScriptArgs()` default | Includes the eval code, or the `--lang` value and filename, as positional args when those flags were used | `parse-script-args.ts:17` | exec F4 |
| `env` | An empty-string variable reads as `undefined` and is dropped from every child process. **(re-verified)** | `env.ts:9` | exec F5 |
| `exec(somePath)` | A `Path` argument is word-split, so a path with a space fails | `to-argv.ts:13-14` | exec F7 |
| `exec` spawn failure | On macOS a missing command or bad `cwd` throws `posix_spawn error: ...` without naming what failed, even with `failOnNonZeroStatus: false`. On Linux the same case returns status 127. | QuickJS `os.exec` | exec F6 |
| `glob` | Matches nothing when cwd or `dir` contains `[`. Throws on an absolute path to a literal file. `glob([])` returns the whole tree. `../` patterns never match. A trailing `/` doesn't restrict to dirs. `!(...)` extglob is treated as negation. Backslash escapes don't work. | `glob.ts` (see report) | exec F9-F15 |
| `cat`, `readFile` on pipes | Buffer sized from `stat`, so `/dev/stdin` and FIFOs are truncated or empty. `readFile` string mode on a pipe throws "Illegal seek". | `cat.ts:60-63`, `readFile.ts:42-46` | commands #7, fs #13 |
| `which` | Returns directories, and `which("")` returns the first PATH entry. An empty PATH entry searches `/` instead of cwd. Names with a slash always return null. | `which.ts:12, 76, 84` | commands #8-10 |
| `TOML.parse` | `t = 07:32:00` followed by a newline is a parse error. Integers past int64 wrap silently. Implements TOML 0.5, so mixed-type arrays are rejected. The library (@iarna/toml) is unmaintained. | upstream `toml-parser.js:1143`, `:189` | formats #4, #7, #18 |
| `.toml`/`.yaml` imports | Lossy: Dates become strings, Infinity/NaN become null, Sets become `{}`, big integers throw | `extension-handlers/toml.ts`, `yaml.ts` embed via `JSON.stringify` | formats #5 |
| `GitRepo` | Follows an inherited `GIT_DIR`, so inside a git hook it reports on the wrong repo. `findRoot` ignores `.git` files (submodules, worktrees). `isWorkingTreeDirty` runs `git diff --quiet`, which misses staged and untracked changes. | `git-repo.ts` | formats #6, #8, #10 |
| `logger.info`/`warn`, `assert` messages, `copy`/`exec`/`mkdir` log lines | Always contain ANSI escapes, even when stderr is a file and with `CLICOLOR=0`. `console.error` picks its colors based on stdout, not stderr. | `kleur.enabled = true` at `strings.ts:5`, `has-colors.ts:17` | console #4-5, types #5 |
| `help()` | A pre-release version like `v1.0.0-rc.1` links to the `v1.0.0` tag, which won't exist yet during an RC | `help.ts:18` | formats #11 |
| `-e` and REPL imports | If the input contains an import line, every other line is silently dropped. **(re-verified)** A default import of JSON/YAML/TOML/CJS gives `undefined`. In the TS/TSX REPL, imports are compiled away entirely. | `esm-to-require.ts:27-72`, `:32`; sucrase import elision in `js-repl.ts:27-30` | runtime #3, #11-12 |
| ESM importing CommonJS | `import x from "./cjs.js"` fails with "Could not find export 'default'", so ESM code can't import most npm packages; only `require` unwraps CJS | `cjs-interop.ts:64-102` | runtime #8 |
| CommonJS detection | A regex over the source text, so a file that mentions `module.exports` in a comment or string and declares its own `exports`/`module` fails to load | `cjs-interop.ts:59-62` | runtime #7 |
| Worker static imports | Skip yavascript's loader: a worker can't statically import `.ts`/`.coffee`/`.civet` or use extensionless paths. A worker file with a shebang fails to load. | the bootstrap is prepended to the module source, `worker.ts:77-86` | runtime #6, #15 |
| http(s) modules | A URL module can't import its own relative or root-relative dependencies (it looks on the local disk). `with { type: "json" }` on a URL silently gives an empty module. | `module-hooks.ts:52-123`, `http.ts:29` | runtime #9 |
| `require(path, { with })` | Drops the import attributes, even though the docs show this exact usage | `cjs-interop.ts:10-22` | runtime #10 |
| Module-not-found errors | `err.name` is overwritten with the module specifier | `module-hooks.ts:99-105` | runtime #16 |

## 2. Decisions to make before 1.0

These are behaviors that would be breaking to change later. Each one is working as coded but is surprising or inconsistent, so it's worth deciding on purpose.

| Topic | Current behavior | Ref |
| --- | --- | --- |
| "Same as the unix command" claims | `remove` throws on a missing path (`rm -rf` doesn't). `rename` can't move into a dir. `copy` dereferences symlinks and drops dir modes. `basename`/`dirname` treat `\` as a separator on POSIX. `chmod` has no symbolic modes, and `"set"` clears every class you don't mention. `mkdirp` applies `mode` to intermediate dirs. `printf` rejects `%lld`, `%zu`, positional args. Either match the commands or drop the claims. | fs #16-18, commands #3, #14, #19, #24, #27 |
| Stub globals (`cp`, `rm`, `id`, `where`, `FILE`, ...) | `typeof cp` throws instead of returning `"undefined"`, which breaks feature detection in libraries | commands #31, crosscut #21 |
| Return types | `basename`/`extname`/`__filename` return strings; `dirname`/`pwd`/`ls`/`which`/`readlink`/`realpath` return `Path`. `which` is the only command that rejects `Path` input. | commands #28 |
| Physical vs logical paths | `pwd()` and `ls()` resolve symlinks (bash's `pwd` doesn't). `ls` is unsorted. `cd` doesn't update `env.PWD`. No `~` expansion anywhere; `mkdirp("~/x")` creates a literal `./~/x`. | commands #21-23, #29 |
| `console` surface | Only `log`/`info`/`warn`/`error`/`clear`. `console.debug`, `trace`, `time`, `table`, `group`, `count`, `assert` are missing and crash npm code that calls them. No `%s` substitution. `console.log` uses different options from `inspect`. `Error.cause` and `AggregateError.errors` aren't shown. | console #11-15 |
| Color policy | `NO_COLOR` and `FORCE_COLOR` are ignored (only `CLICOLOR`/`CLICOLOR_FORCE` are honored). The color functions always emit escapes, and there's no public "has colors" check. | console #14, #16 |
| `inspect.custom` protocol | The hook has to mutate the `inputs` object; its return value is ignored. Node's `Symbol.for("nodejs.util.inspect.custom")` isn't honored. | console #13, crosscut #17 |
| `exec` `env` option | Replaces the whole environment rather than merging. Intended per tests, but undocumented. | exec F23 |
| `--lang` after the script filename | Consumed by yavascript (snapshot-tested as intended), so scripts can't have their own `--lang` flag | exec F3 |
| `GitRepo` relative paths | The constructor and `findRoot` reject relative paths, including the `new GitRepo(".")` that every doc example uses | formats #9 |
| `process.version` | Claims Node `v16.19.0`, so libraries that gate on it take old code paths | crosscut #27 |
| `yavascript.ecmaVersion` | `"ES2023"`, but `WeakRef` (ES2021) is missing and many ES2025 features are present | crosscut #26 |
| `npm:` imports | Rewritten to the Skypack CDN (marked `HACK` in `npm.ts:5`), so 1.0 would depend on a third-party CDN staying up | crosscut #30 |
| `yavascript.compilers` | Replacing one changes how files load (a real extension point, undocumented). `esmToCjs` exists and is snapshot-tested but undocumented. | formats #13, #29 |
| `help()` target | Still points at GitHub markdown, not the website (the open item in `todo.md`). The website's docusaurus `url` is still the template placeholder. | formats #38 |
| `setTimeout` extra args | Dropped instead of passed to the callback | crosscut #28 |
| `yavascript -- script.js` | Opens the REPL and ignores the file (snapshot-tested as intended). `node -- file.js` runs the file, and in CI this form hangs because of the EOF spin. | runtime #33 |
| Import attribute `type` names | `type: "typescript"` works but `type: "ts"` (a valid `--lang`) is silently ignored. `type: "json"` is strict JSON while a plain `.json` import is JSON5, so adding the standard attribute can break a file that loads without it. | runtime #29 |
| Worker globals | Inside a worker there's no `runInWorker`, `Context`, nested `Worker` or `scriptArgs`, and the layer internals aren't cleaned up. The docs say workers get all the globals. | runtime #26 |

## 3. Docs that don't match behavior

Grouped. Details and repros are in the area reports.

- **Typings accept code that fails at runtime:** 12 `BigInt.*` methods (`tdiv`, `sqrt`, ...) are declared but don't exist. **(re-verified)** `std.sprintf` is typed as returning `void`. `types.optional` is documented but untyped, and doesn't coerce. `JSX.createElement(type, ...children)` is typed but not implemented. `types.record(Number, ...)` never matches. (crosscut #3, #6; types #10, #13-14)
- **Typings reject code that works:** `is`/`assert.type` narrow object shapes, arrays, classes, `BigInt` and `Symbol` to the wrong type (`{a: Number}` narrows to `{ a: TypeValidator<number> }`). No `JSX.IntrinsicElements`, so every `<div>` errors in a strict `.tsx` file. `env.FOO = 5` and `types.arrayOf` hints for `parseScriptArgs` are rejected. The `runInWorker` type rejects sync functions. (types #4, #9; exec F27, F29; crosscut #10)
- **Undeclared runtime APIs:** `process.platform`, `performance`, `Path.from`, `yavascript.compilers.esmToCjs`, `types.objectOrNull`/`anyTypeValidator`/`unknownTypeValidator`, and the leaked internal `types.objectStr`. (crosscut #11-12)
- **Wrong examples:** `new GitRepo(".")` throws. The `quickjs:cmdline` example imports a nonexistent `scriptArgs`. `ModuleDelegate` examples use a nonexistent global. The `runInWorker` example is missing `await`. The JSX Fragment example logs the wrong variable. A stale `is` signature is still in the docs. (formats #9; crosscut #7-10, #15)
- **Wrong descriptions:**
  - `captureOutput: "utf-8"` (only `"utf8"` works).
  - `logger.trace` described as writing to stderr (it's a no-op).
  - `isWorkingTreeDirty` described as running `git status --quiet`, which isn't a real flag.
  - `process.exitCode` docs name nonexistent `std` functions.
  - `exit.code` in a Worker is said to throw (it's silently ignored).
  - `sleep.async` is said to never reject (it can).
  - `which` documents an `options.trace` that doesn't exist.
  - The `ChildProcess` `STOPPED`/`CONTINUED` states can never occur.
  - `glob`'s `dir` must be absolute, which isn't documented.
  - `scriptArgs[0]` is described as the script name (it's the binary).
  - `RegExp.escape` is described as "stage 2" (it's standard now).
  - The Sucrase and Civet versions are stale (the docs say Civet 0.9.0; 0.11.14 is bundled).
  - `YAML.stringify` is described as working like `JSON.stringify` (it doesn't).
  - The YAML multi-doc error tells you to call a `YAML.parseAllDocuments()` that doesn't exist.

  (exec F22-F28; formats #8, #12, #14-15; commands #11-13; crosscut #9, #13-14)
- **Runtime and modules:**
  - `StructuredClonable` lists `RegExp`, `DataView` and `Error`, which `postMessage` rejects.
  - `Worker.terminate()` is described as terminating the thread.
  - `InteractivePrompt`'s `printInput` only works if its output is exactly as wide as the input.
  - yavascript's module resolution rules aren't documented anywhere. The only doc is QuickJS's, which says `searchExtensions` defaults to `[".js"]`.

  (runtime #17-18, #27, #30)
- **Generated web docs** drop doc comments on option-object properties, so `Context`'s `yavascriptGlobals` or `bytecode`'s `strip` are never explained. `generated-doc-links.json5` has 7 broken anchors and no entries for `yavascript`, `process`, `global`, or the timers. (crosscut #16, #18)
- **Build nit:** the repo-root `yavascript.d.ts` is never run through prettier, because prettier 3 honors `.gitignore` and `dist` is ignored. So it differs from `--print-types` in about 40 formatting spots. (`meta/ninja/dts.ninja.ts:48-52`, crosscut #19)

## 4. Missing capabilities

Things a 1.0 bash replacement will likely be asked about. Every one was checked against `yavascript.d.ts` first.

| Area | Missing | Closest today |
| --- | --- | --- |
| stdin | reading stdin, `cat("-")` | `std.in.readAsString()` |
| files | stat/size/mtime, append, symlink creation, `mktemp` (file or dir), `head`/`tail`/`wc`/`tee`, `chown` | raw `os.stat`, `os.open` + `O_APPEND`, `os.symlink`, `std.tmpfile()` (no path) |
| `writeFile` | `Uint8Array`/`DataView` input (passing `.buffer` writes the whole backing buffer) | `ArrayBuffer` only |
| processes | stdin input to `exec`, timeouts, kill, pipelines, stdout-only capture, `$` with options | `ChildProcess` + `os.pipe` by hand; `os.SIGKILL` is undefined |
| args | `--no-foo`, short-flag bundling, help/usage output, required/unknown flag errors | `parseScriptArgs` |
| formats | YAML multi-doc and merge keys, CSV header-row mapping and options, INI, `.env`, `JSON5` global, CSV import loader | |
| git | changed-file list, staged vs untracked, remote URL, tags/describe, short SHA | `exec("git ...")` |
| CLI | running a script from stdin (`yavascript -`, `curl ... \| yavascript`), top-level `await` and `import.meta` in `-e` and the REPL | none; `/dev/stdin` fails with "Illegal seek" |
| modules | package.json `exports`, extensionless `main`, `.cjs`, `.mts`/`.cts`, `require("./data")` finding `data.json`, `require.main` | `main` naming a full filename |
| Node compat | named imports from `node:process`, `process.stdout`/`stderr`/`cwd()`/`on`/`nextTick`, a hint when `require("fs")` etc. fails | default `process` import |
| `InteractivePrompt` | `stop()`, an end-of-input callback, awaiting an async `handleInput` | |
| `help` | per-symbol help (`help(YAML)`) even though the whole d.ts is embedded | |
| `types` | `Promise`, `WeakMap`, `WeakSet`, BigInt typed arrays; path info in nested `assert.type` failures | `types.instanceOf(...)` |
| JS built-ins | `structuredClone`, `fetch`, `URL`, global `TextEncoder`/`TextDecoder`, `atob`/`btoa`, `crypto`, `queueMicrotask`, `AbortController`, `Intl` (`toLocaleString` silently ignores locale/options), `WeakRef`, `using`/`Symbol.dispose`, `Array.fromAsync`, `Error.captureStackTrace` | `std.urlGet`, `quickjs:encoding`, `Uint8Array` base64 |

The full built-ins matrix is in [crosscut.md](crosscut.md#built-ins-matrix).

## 5. Test coverage gaps

- **No tests at all:**
  - Commands and filesystem: `chmod`, `touch`, `rename` (there's a `// rename test TODO`).
  - Other APIs: `RegExp.escape`, `String.dedent`, `YAML.parse`/`stringify`, `is()`, `openUrl`, `help()`.
  - Loading and modules: the non-JS compilers, extensionless scripts, the `http:`/`https:`/`npm:` protocols, `node_modules` package resolution (no fixture has a `package.json`), `require(..., { with })`, `\load`.
  - Exit behavior: exit codes for a throw in a timer or worker handler.
- **Happy path only:** `copy` (one test), `CSV` (one round-trip without a trailing newline), `TOML`, `Promise.map`, `grep`, `which`, `sleep`, `exit`, `ls`, `cat`, `parseScriptArgs` (one snapshot), `ChildProcess`.
- **Tests that can't catch what they look like they check:**
  - The default sanitizers strip ANSI, so the always-on escape codes are invisible.
  - The `git-repo.test.ts` "relative isIgnored" snapshot collapses its key lines to `at somewhere` (the stack-trace sanitizer eats lines starting with `at `).
  - The `ls` tests `.sort()` before comparing, which hides the missing sort.
  - The `.tsx` fixture's `/// <reference path>` points at a file that doesn't exist, and fixtures are never typechecked.
  - `runInWorker.test.ts` "function rejects" passes by accident: the worker's own error print matches the snapshot, but the rejection handler is never called.
  - The REPL "import statements are rewritten" test imports `basename` from `quickjs:os`, which doesn't export it, so the snapshot shows `undefined` and would pass even if imports did nothing.
  - The REPL helpers always end with Ctrl+D or Ctrl+C and never close stdin, so the EOF spin is invisible.
- **No TypeScript usage tests:** nothing typechecks `is`/`assert.type` narrowing or JSX against the published d.ts, which is how the wrong narrowing went unnoticed.
- **No `Path` objects passed to any fs function** in any test.
