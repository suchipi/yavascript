# YavaScript 1.0 API audit

Binary: `dist/yavascript` built from `d8cc554` (`--version` prints `git-d8cc554c0810`). Every documented API was exercised by hand against that binary, split across 8 areas. Each area has its own detailed report next to this file, with an exact repro and actual output for every finding.

| Area | Report | Findings |
| --- | --- | --- |
| Filesystem, `Path`, `__filename`/`__dirname` | [fs.md](fs.md) | 18 |
| Shell-style commands and "did you mean" stubs | [commands.md](commands.md) | 24 |
| `exec`/`$`/`ChildProcess`, `glob`, `env`, `parseScriptArgs`, `openUrl` | [exec-glob-env-args.md](exec-glob-env-args.md) | 28 |
| `types`, `is`, `assert`, `number`/`string`/..., JSX | [types-is-assert-jsx.md](types-is-assert-jsx.md) | 17 |
| `console`, `inspect`, colors, grep, `logger`, `RegExp.escape`, `String.dedent`, `Promise.map` | [console-strings-grep-logger.md](console-strings-grep-logger.md) | 20 |
| YAML, CSV, TOML, `GitRepo`, `yavascript`, `help` | [formats-git-yavascript-help.md](formats-git-yavascript-help.md) | 30 |
| d.ts vs runtime, QuickJS `std`/`os`, doc quality, built-ins | [crosscut.md](crosscut.md) | 27 |
| Worker, `Context`, REPL, Node compat, modules, languages, CLI | [runtime-modules-cli.md](runtime-modules-cli.md) | 23 |

The test suite passes on this build (713 passed, 1 skipped). None of the bugs in section 1 are covered by it.

## 1. Must fix before 1.0

### Hangs and crashes

| API | Problem | Cause | Ref |
| --- | --- | --- | --- |
| `Worker.terminate()` | Doesn't stop the thread; a busy worker keeps the process alive forever. There's no way to cancel a worker or a `runInWorker` call. | | runtime #6 |
| `quickjs:bytecode` | A module from `bytecode.fromFile(..., { sourceType: "module" })` passed to `toValue()` but never called makes the process abort at exit with code 134 (`JS_FreeRuntime` assertion) | not investigated; the assertion is in the QuickJS fork | crosscut #1 |

### Broken or wrong on common paths

| API | Problem | Cause | Ref |
| --- | --- | --- | --- |
| `mkdir` a bare relative name | `mkdir("newdir")` throws `PathErrors.ZeroSegmentsError`. `./newdir`, absolute paths and `mkdirp("newdir")` work. | `mkdir.ts:116` calls `dirname` on the target, and `dirname` of a one-segment path throws | commands #1 |
| `-e` and REPL imports | An import followed by code on the same line, by trailing whitespace, or by a line starting with `[` or `(` fails with a `SyntaxError`, `ReferenceError` or `TypeError` | `esm-to-require.ts:18` writes `[;\s]*` inside a template literal, where `\s` is just `s`; `:86-97` never adds a `;` after a rewritten import | runtime #1 |
| `.json`/`.yaml` URL imports | Importing `http(s)://.../data.json` or `.yaml` without `with { type }` silently gives an empty module, while a local `.json` import works without the attribute | `http.ts:33-41` (shared by `https.ts`) picks a compiler only from the `type` attribute and otherwise runs `autodetect`, ignoring the extension | runtime #5 |
| `logger.info`/`warn` object args, uncaught errors | Inspected objects are colored based on whether stdout is a TTY, so a redirected stderr still gets ANSI escapes when stdout is a terminal (and the reverse) | `make-inspect-log.ts:18` and `print-error.ts:40,46` call `forPrint()` without a file | console #1 |
| REPL `\load` | A throwing file prints to stderr with 9 internal frames; `.ts` files can't be loaded; `\load` is missing from `\h` | `js-repl.ts:82-88` runs the file with `engine.runScript`, outside `evalAndPrint`'s try/catch | runtime #3 |
| Module-not-found errors | The location points into `layer1.js` instead of the importing line; `require` throws away the resolver's error; neither has a `code` | `module-hooks.ts:138-144`, `cjs-interop.ts:13-20` | runtime #4 |
| `new Context(...)` options | `modules: { "quickjs:bytecode": false }` fails with a file error, `console: false` is ignored, and unknown or non-object options are accepted | `context.ts:19-28` checks only `date`, `promise` and `moduleGlobals` | runtime #2 |
| `console.log` | When inspect fails (revoked Proxy, throwing `inspect.custom`), stderr gets a bare message like `revoked proxy` with no context | `make-inspect-log.ts:55` writes only `err.message` | console #2 |
| `parseScriptArgs` | `---` and `--!` become a flag named `""` | clef-parse's `isFlag` and `convert-case.js` | exec F3 |

## 2. Decisions to make before 1.0

These are behaviors that would be breaking to change later. Each one is working as coded but is surprising or inconsistent, so it's worth deciding on purpose.

| Topic | Current behavior | Ref |
| --- | --- | --- |
| "Same as the unix command" claims | `rename` can't move into a dir. `copy` preserves file times and never applies `whenTargetExists` to dirs. `basename`/`dirname` treat `\` as a separator on POSIX. `chmod` has no symbolic modes, and `"set"` clears every class you don't mention. `mkdirp` applies `mode` to intermediate dirs. `printf` rejects `%lld`, `%zu`, positional args. Either match the commands or drop the claims. | fs #1-2, commands #2, #7, #11, #15, #18 |
| Stub globals (`cp`, `rm`, `id`, `where`, `FILE`, ...) | `typeof cp` throws instead of returning `"undefined"`, which breaks feature detection in libraries | commands #22, crosscut #18 |
| Return types | `basename`/`extname`/`__filename` return strings; `dirname`/`pwd`/`ls`/`which`/`readlink`/`realpath` return `Path`. `which` is the only command that rejects `Path` input. | commands #19 |
| Physical vs logical paths | `pwd()` and `ls()` resolve symlinks (bash's `pwd` doesn't). `cd` doesn't update `env.PWD`. No `~` expansion anywhere; `mkdirp("~/x")` creates a literal `./~/x`. | commands #12-13, #20 |
| `console` surface | Only `log`/`info`/`warn`/`error`/`clear`. `console.debug`, `trace`, `time`, `table`, `group`, `count`, `assert` are missing and crash npm code that calls them. No `%s` substitution. `console.log` uses different options from `inspect`. `Error.cause` and `AggregateError.errors` aren't shown. | console #3-4, #6-7 |
| Color policy | `NO_COLOR` and `FORCE_COLOR` are ignored (only `CLICOLOR`/`CLICOLOR_FORCE` are honored). The color functions always emit escapes, and there's no public "has colors" check. | console #6, #8 |
| `inspect.custom` protocol | The hook has to mutate the `inputs` object; its return value is ignored. Node's `Symbol.for("nodejs.util.inspect.custom")` isn't honored. | console #5, crosscut #14 |
| `exec` `env` option | Replaces the whole environment rather than merging. Intended per tests, but undocumented. | exec F6 |
| `--lang` after the script filename | Consumed by yavascript (snapshot-tested as intended), so scripts can't have their own `--lang` flag | exec F1 |
| TOML version | @iarna/toml implements TOML 0.5, so mixed-type arrays are rejected, and the library is unmaintained | formats #9 |
| `process.version` | Claims Node `v16.19.0`, so libraries that gate on it take old code paths | crosscut #24 |
| `yavascript.ecmaVersion` | `"ES2023"`, but `WeakRef` (ES2021) is missing and many ES2025 features are present | crosscut #23 |
| `npm:` imports | Rewritten to the Skypack CDN (marked `HACK` in `npm.ts:5`), so 1.0 would depend on a third-party CDN staying up | crosscut #27 |
| `yavascript.compilers` | Replacing one changes how files load (a real extension point, undocumented). `esmToCjs` exists and is snapshot-tested but undocumented. | formats #4, #20 |
| `help()` target | Still points at GitHub markdown, not the website (the open item in `todo.md`). The website's docusaurus `url` is still the template placeholder. | formats #29 |
| `setTimeout` extra args | Dropped instead of passed to the callback | crosscut #25 |
| `yavascript -- script.js` | Opens the REPL and ignores the file (snapshot-tested as intended). `node -- file.js` runs the file, and in CI this form exits 0 without running the script. | runtime #22 |
| Unsettled top-level `await` | The script stops at the `await` and exits 0 silently. Node exits 13 with a warning. | runtime #23 |
| Import attribute `type` names | `type: "typescript"` works but `type: "ts"` (a valid `--lang`) is silently ignored, as is any unknown type | runtime #18 |
| Worker globals | Inside a worker there's no `runInWorker`, `Context`, nested `Worker` or `scriptArgs`, and the layer internals aren't cleaned up. The docs say workers get all the globals. | runtime #15 |

## 3. Docs that don't match behavior

Grouped. Details and repros are in the area reports.

- **Typings accept code that fails at runtime:** 12 `BigInt.*` methods (`tdiv`, `sqrt`, ...) are declared but don't exist. `std.sprintf` is typed as returning `void`. `types.optional` is documented but untyped, and doesn't coerce. `JSX.createElement(type, ...children)` is typed but not implemented. (crosscut #2-3; types #3, #6)
- **Typings reject code that works:** `is`/`assert.type` narrow object shapes, arrays, classes, `BigInt` and `Symbol` to the wrong type (`{a: Number}` narrows to `{ a: TypeValidator<number> }`). No `JSX.IntrinsicElements`, so every `<div>` errors in a strict `.tsx` file. `env.FOO = 5` and `types.arrayOf` hints for `parseScriptArgs` are rejected. The `runInWorker` type rejects sync functions. (types #1-2; exec F10, F12; crosscut #7)
- **Undeclared runtime APIs:** `process.platform`, `performance`, `Path.from`, `yavascript.compilers.esmToCjs`, `types.objectOrNull`/`anyTypeValidator`/`unknownTypeValidator`, and the leaked internal `types.objectStr`. (crosscut #8-9)
- **Wrong examples:** `new GitRepo(".")` throws, and neither `GitRepo` nor `findRoot` documents that relative paths are rejected. The `quickjs:cmdline` example imports a nonexistent `scriptArgs`. `ModuleDelegate` examples use a nonexistent global. The `runInWorker` example is missing `await`. The JSX Fragment example logs the wrong variable. A stale `is` signature is still in the docs. (formats #2; crosscut #4-5, #7, #12)
- **Wrong descriptions:**
  - `exec` with `failOnNonZeroStatus: false` is said to return `{ status, signal }`, but a program that can't be spawned throws.
  - `captureOutput: "utf-8"` (only `"utf8"` works).
  - `ChildProcessOptions` says `logger.trace` writes to stderr (it's a no-op).
  - `process.exitCode` docs name nonexistent `std` functions.
  - `exit.code` in a Worker is said to throw (it's silently ignored).
  - `which` documents an `options.trace` that doesn't exist.
  - The `ChildProcess` `STOPPED`/`CONTINUED` states can never occur.
  - `glob`'s `dir` must be absolute, which isn't documented.
  - `scriptArgs[0]` is described as the script name (it's the binary).
  - `parseScriptArgs` says its default is `scriptArgs.slice(2)`, but it's the args the CLI hands the script, without yavascript's own flags or the first `--`.
  - The Sucrase and Civet versions are stale (the docs say Civet 0.9.0; 0.11.14 is bundled).
  - `YAML.stringify` is described as working like `JSON.stringify` (it doesn't).
  - The YAML multi-doc error tells you to call a `YAML.parseAllDocuments()` that doesn't exist.

  (exec F2, F5, F7-F11; formats #3, #5-6; commands #5-6; crosscut #6, #10-11)
- **Runtime and modules:**
  - `StructuredClonable` lists `RegExp`, `DataView` and `Error`, which `postMessage` rejects.
  - `Worker.terminate()` is described as terminating the thread.
  - `InteractivePrompt`'s `printInput` only works if its output is exactly as wide as the input.
  - yavascript's module resolution rules aren't documented anywhere. The only doc is QuickJS's, which says `searchExtensions` defaults to `[".js"]`.

  (runtime #6-7, #16, #19)
- **Generated web docs** drop doc comments on option-object properties, so `Context`'s `yavascriptGlobals` or `bytecode`'s `strip` are never explained. `generated-doc-links.json5` has 7 broken anchors and no entries for `yavascript`, `process`, `global`, or the timers. (crosscut #13, #15)
- **Build nit:** the repo-root `yavascript.d.ts` is never run through prettier, because prettier 3 honors `.gitignore` and `dist` is ignored. So it differs from `--print-types` in about 40 formatting spots. (`meta/ninja/dts.ninja.ts:48-52`, crosscut #16)

## 4. Missing capabilities

Things a 1.0 bash replacement will likely be asked about. Every one was checked against `yavascript.d.ts` first.

| Area | Missing | Closest today |
| --- | --- | --- |
| stdin | reading stdin, `cat("-")` | `cat("/dev/stdin")` (undocumented, needs `/dev/stdin`), `std.in.readAsString()` |
| files | stat/size/mtime, append, symlink creation, `mktemp` (file or dir), `head`/`tail`/`wc`/`tee`, `chown` | raw `os.stat`, `os.open` + `O_APPEND`, `os.symlink`, `std.tmpfile()` (no path) |
| `writeFile` | `Uint8Array`/`DataView` input (passing `.buffer` writes the whole backing buffer) | `ArrayBuffer` only |
| processes | stdin input to `exec`, timeouts, kill, pipelines, stdout-only capture, `$` with options | `ChildProcess` + `os.pipe` by hand; `os.SIGKILL` is undefined |
| args | `--no-foo`, short-flag bundling, help/usage output, required/unknown flag errors | `parseScriptArgs` |
| formats | YAML multi-doc and merge keys, CSV header-row mapping and options, INI, `.env`, `JSON5` global, CSV import loader | |
| git | changed-file list, staged vs untracked, remote URL, tags/describe, short SHA | `exec("git ...")` |
| CLI | running a script from stdin (`yavascript -`, `curl ... \| yavascript`), top-level `await` and `import.meta` in `-e` and the REPL | none; `/dev/stdin` fails with "Illegal seek" |
| modules | named imports from CommonJS, package.json `exports`, extensionless `main`, `.cjs`, `.mts`/`.cts`, `require("./data")` finding `data.json`, `require.main` | `main` naming a full filename |
| Node compat | named imports from `node:process`, `process.stdout`/`stderr`/`cwd()`/`on`/`nextTick`, a hint when `require("fs")` etc. fails | default `process` import |
| `InteractivePrompt` | `stop()`, an end-of-input callback, awaiting an async `handleInput` | |
| `help` | per-symbol help (`help(YAML)`) even though the whole d.ts is embedded | |
| `types` | `Promise`, `WeakMap`, `WeakSet`, BigInt typed arrays; path info in nested `assert.type` failures | `types.instanceOf(...)` |
| JS built-ins | `structuredClone`, `fetch`, `URL`, global `TextEncoder`/`TextDecoder`, `atob`/`btoa`, `crypto`, `queueMicrotask`, `AbortController`, `Intl` (`toLocaleString` silently ignores locale/options), `WeakRef`, `using`/`Symbol.dispose`, `Array.fromAsync`, `Error.captureStackTrace` | `std.urlGet`, `quickjs:encoding`, `Uint8Array` base64 |

The full built-ins matrix is in [crosscut.md](crosscut.md#built-ins-matrix).

## 5. Test coverage gaps

Each area report ends with its own coverage notes; these are the ones that cut across areas.

- **No tests at all:** `touch`, `openUrl`, `inspect` (no dedicated test file), `YAML.stringify`, the `https:` and `npm:` protocols, `node_modules` package resolution (no fixture has a `package.json`), and direct tests of the non-JS compilers. `rename` has a single test, so moving into a directory and the EXDEV cross-filesystem path are untested.
- **Happy path only:** `exit`, `ChildProcess`, `printf` and `whoami`. Most `types.*` validators and constructors have no tests at all.
- **Tests that can't catch what they look like they check:**
  - Every `mkdir` test without `recursive` uses an absolute path, which is how the bare-relative-name bug (commands #1) got through.
  - The `mkdir` recursive "relative path" and "absolute path" tests snapshot an empty stderr, so they pin the missing info line (commands #10) instead of testing it.
  - The `printInput` test in `interactive-prompt.test.ts` goes through the ANSI sanitizer, which strips the cursor moves that runtime #16 is about.
  - The `cjs-interop.test.ts` "a JSON file required through an import attribute" test passes `{ type: "json" }` instead of `{ with: { type: "json" } }`, on a `.json` file, so it passes whether or not attributes are honored.
- **No TypeScript usage tests:** nothing typechecks `is`/`assert.type` narrowing or JSX against the published d.ts, which is how the wrong narrowing went unnoticed (types #1-2). The `.tsx` fixtures run but are never typechecked; under `strict` they give TS7026.
- **Path objects in fs functions:** apart from an incidental `exists(...)` on `which`'s result in `which.test.ts`, no test passes a `Path` to a filesystem function.
