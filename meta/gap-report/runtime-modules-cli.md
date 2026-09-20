# API audit: runtime, modules, CLI

Area: Layer 3 (`Worker`, `runInWorker`, `Context`), REPL (`InteractivePrompt`, `startRepl`, default REPL), Node compat (`global`, `process`), module system, languages, and the CLI.

Every result below comes from a command run against the current `./dist/yavascript` (`git-3eedd831a85c`, arm64 macOS), always under a perl alarm. Sandbox files live in `.tmp/api-audit/runtime-sandbox/`, and repro commands are run from that directory unless they `cd` somewhere else.

Helpers (both in the sandbox):

- `y.sh` runs the binary with `perl -e 'alarm ...'` (default 15s, `T=` to change), `HOME` set to `runtime-sandbox/home`, `CLICOLOR=0`, stdin from `/dev/null` (or piped from `IN='printf-format'`), and prints `[exit=N]`. Exit 142 means the alarm fired, i.e. a hang.
- `drive.js` is a pipe-based driver in the same style as `meta/tests/src/repl-helpers.ts`: it keeps stdin open, writes `|`-separated chunks 300ms apart (`{cr}`, `{tab}`, `{esc}`, `{x04}` etc. are key bytes), and SIGKILLs at `DEADLINE` ms. `YS_FOO=bar` sets `FOO` in the child's env; `RAW=1` shows escape codes.

## Summary

| # | Severity | API | Summary |
| --- | --- | --- | --- |
| 1 | bug | `runInWorker` | Never settles when the function throws synchronously or rejects with an Error; script exits 0 |
| 2 | bug | REPL, `InteractivePrompt` | Spins at 100% CPU forever when stdin hits EOF |
| 3 | bug | `-e`, REPL | Any import line replaces the whole input; other lines silently dropped |
| 4 | bug | exit codes | Uncaught exception in a timer (or main-side worker handler) exits 0 |
| 5 | bug | `Context` | `{ date: false }` / `{ promise: false }` throw, then the process aborts at exit (134) |
| 6 | bug | `Worker` | Static imports in a worker skip yavascript's loader (no TS/Coffee/Civet, no search extensions) |
| 7 | bug | module loading | CommonJS detection is a source regex; files mentioning `module.exports` break |
| 8 | gap | module loading | ESM `import` of a CommonJS module/package doesn't work |
| 9 | bug | http(s) modules | Relative and root-relative imports inside URL modules fail; attributes ignored |
| 10 | bug | `require` | `require(path, { with })` drops the import attributes |
| 11 | bug | REPL, `-e` | Default import of JSON/YAML/TOML/CJS gives `undefined` |
| 12 | bug | TS/TSX REPL | Imports are compiled away (sucrase import elision) |
| 13 | bug | REPL `\load` | A failing `\load` wedges the REPL |
| 14 | bug | `InteractivePrompt` | A throwing `handleInput` kills the prompt and glues the next line on |
| 15 | bug | `Worker` | A worker file that starts with a shebang fails to load |
| 16 | bug | module resolution | "Couldn't resolve module" errors have `err.name` set to the specifier |
| 17 | doc-mismatch | `Worker.terminate` | Doesn't terminate the thread; a busy worker keeps the process alive forever |
| 18 | doc-mismatch | `StructuredClonable` | `RegExp`, `DataView`, `Error` are listed but rejected |
| 19 | gap | module resolution | No `exports`, extensionless `main`, `.cjs`, `.mts`/`.cts` |
| 20 | gap | node-compat | No named exports from `node:process`; no `process.stdout`/`cwd`/`on`/... |
| 21 | gap | `-e`, REPL | No top-level `await` or `import.meta` |
| 22 | gap | CLI | No way to run a script from stdin |
| 23 | gap | `InteractivePrompt` | No `stop()`, no end callback, async `handleInput` not awaited |
| 24 | rough-edge | REPL | Multi-line is JS-only (Coffee/Civet blocks impossible); directives run on continuation lines |
| 25 | rough-edge | REPL | Can't start when the config dir can't be created |
| 26 | rough-edge | `Worker` | Worker globals differ from main (no `runInWorker`/`Context`, leaked internals), undocumented |
| 27 | doc-mismatch | `InteractivePrompt.printInput` | Output must match the input's width |
| 28 | rough-edge | REPL completion | Tab evaluates getters and prints their exceptions |
| 29 | rough-edge | import attributes | `type` names differ from `--lang`; `type: "json"` is strict while `.json` is JSON5; unknown types silently ignored |
| 30 | doc-mismatch | module system | yavascript's resolution rules aren't documented anywhere |
| 31 | rough-edge | CLI | Missing-file and compile errors show errno text and internal frames |
| 32 | rough-edge | CLI | `-v` prints no trailing newline |
| 33 | question | CLI | `yavascript -- script.js` opens the REPL |
| 34 | question | module evaluation | Unsettled top-level `await` exits 0 silently |

## Findings

### 1. bug: `runInWorker` never settles when the worker function throws synchronously or rejects with an Error; the script then exits 0

- API: `runInWorker` (`src/layer3/runInWorker.ts`)
- Repro: `cd worker && ../y.sh riw-await.js`, `../y.sh riw-reject.js sync-throw`, `../y.sh riw-reject.js async-throw-error`, `T=40 ../y.sh riw.js`
- Expected: the promise rejects with what was thrown (the doc says Error instances can be cloned), so `await runInWorker(...)` throws in the caller and the process exits non-zero.
- Actual:
  - `riw-await.js` (`await runInWorker(null, () => { throw new Error("worker fn failed") })`, then `console.log("after")`): the worker's error is printed to stderr, `after` never runs, and the exit code is **0**.
  - `riw-reject.js sync-throw`: neither the resolve nor the reject handler ever runs.
  - `riw-reject.js async-throw-error` (`async () => { throw new TypeError(...) }`): the worker prints `TypeError: attempting to serialize unsupported object class: ERROR` and the promise stays pending. Only `throw "a string"` from an async function actually rejects.
  - `riw.js`: 12 of 18 cases never settle (caught by a 1.5s race): sync throw of a string or an Error subclass; returning an Error, RegExp, Map or function; using a closure variable (`ReferenceError: 'secret' is not defined` in the worker); a method-shorthand function (`SyntaxError: expecting ')'`); a native or bound function (`ReferenceError: 'native' is not defined`, from `function max() { [native code] }`).
- Cause: `runInWorker.ts:22-24` builds `Promise.resolve((fn)(Worker.initialData))`, so a synchronous throw escapes before `.catch` is attached. The `.catch` posts `{ type: "reject", value: err }`, but QuickJS can't clone Error objects, so that `postMessage` throws inside the worker as well. The main side never sets `worker.onerror` (`runInWorker.ts:35-63`), so worker failures can't reach the promise.
- Test note: `meta/tests/src/runInWorker.test.ts:44-62` ("function rejects") passes only because the worker's own uncaught-error print (`TypeError: oopsie!` + sanitized stack) matches what `console.error` would have printed. The rejection handler is never called.

### 2. bug: REPL and InteractivePrompt spin at 100% CPU forever when stdin hits EOF

- API: default REPL, `startRepl`, `InteractivePrompt`
- Repro: `/usr/bin/time -p perl -e 'alarm 3; exec @ARGV' ../../../dist/yavascript </dev/null`; `IN='1+1\n' T=3 ./y.sh`; `IN='line1\n' T=3 ./y.sh ip/basic.js`
- Expected: EOF ends the prompt like Ctrl+D on an empty line, and the process exits. `echo '1+1' | yavascript` prints `2` and exits.
- Actual: never exits. `time` reports `real 3.01 user 0.97 sys 2.03`, a busy loop. The `InteractivePrompt` case prints `got: "line1"` and then spins until the alarm (exit 142). Running `yavascript` with no args in CI, under `</dev/null`, or from a closed pipe hangs forever. This is what hung the previous audit agent.
- Cause: `termReadHandler` (`src/layer1/api/repl/repl-engine.ts:207-217`) ignores `os.read` returning 0, so the read handler stays installed on an fd that is permanently readable at EOF.

### 3. bug: `-e` code (and multi-line REPL input) is silently replaced by its import line

- API: CLI `-e`, REPL (`src/layer1/esm-to-require.ts`)
- Repro: `bash esm-eval.sh`, which runs `./y.sh -e $'import * as os from "quickjs:os"\nconsole.log("second line ran"); 42'` and `./y.sh -e $'console.log("first line ran")\nimport * as os from "quickjs:os"'`
- Expected: `second line ran` then `42`; `first line ran`.
- Actual: both print only the `quickjs:os` namespace object. The other lines vanish without an error.
- Cause: `transform` (`esm-to-require.ts:27-72`) matches with multiline regexes (`^...$` per line) but returns just the replacement for the import (e.g. `` `${matches[1]} = require(${matches[2]})` ``) instead of splicing it into the input. `evalTarget` (`src/layer5b/targets/eval.ts:13`) and the REPL's `compileLine` (`src/layer1/api/repl/js-repl.ts:27-30`) pass the entire input through it. Related: an import followed by code on the same line (`./y.sh -e 'import { dirname as d } from "quickjs:os"; 1'`) isn't transformed at all and fails with `SyntaxError: expecting '('`.

### 4. bug: an uncaught exception in a timer callback prints but exits 0

- API: exit codes / event loop
- Repro: `cd errs && ../y.sh timer-throw.js`; `./y.sh -e 'setTimeout(() => { throw new Error("timer in eval") }, 1)'`; `cd worker && ../y.sh main-handler-throws.js`; `cd worker && ../y.sh unhandled-worker-error.js`
- Expected: a non-zero exit, as for a synchronous throw (`errs/throw.js` exits 1) or an unhandled rejection (`errs/reject.js`, `errs/async-reject.js` exit 1). Node exits 1 and stops.
- Actual: `Error: in timer` is printed, later timers still run (`second timer`), and the exit code is **0**. Same for a throw in a main-side `Worker` `onmessage` handler, and for an uncaught error inside a worker with no `onerror` (doc says it "prints to stderr", which it does, but the process still exits 0). A CI script that fails inside a timer or message handler reports success.

### 5. bug: `new Context({ date: false })` or `{ promise: false }` throws, and even if caught the process aborts at exit (134)

- API: `Context` (`src/layer3/context.ts`, `context.inc.d.ts`)
- Repro: `./y.sh -e 'try { new Context({ date: false }) } catch (e) { console.log("caught:", e.message) }'` (same with `promise: false`); bisected with `cd ctx && ../y.sh bisect.js dateFalse`
- Expected: the option works, or the constructor throws a clear error and the process exits normally.
- Actual: `caught: 'Date' is not defined` (or `cannot set property 'map' of undefined`), then `Assertion failed: (list_empty(&rt->gc_obj_list)), function JS_FreeRuntime, file /opt/quickjs/src/quickjs/quickjs.c, line 2475.` and exit **134**. Running all of `ctx/ctx.js` ends the same way.
- Cause: with the default `yavascriptGlobals: true`, `context.ts:21-36` evaluates the layer 1/2 bytecode, which needs `Date` and `Promise`; the half-initialized context leaks GC objects that `JS_FreeRuntime` asserts on.
- Related, without the abort: `{ moduleGlobals: false }` throws `TypeError: not a function` (`context.ts:22` calls `this.globalThis.require`); `{ modules: { "quickjs:bytecode": false } }` throws `Failed to load module ... quickjs:bytecode`; `{ console: false }` is silently overridden (`typeof console` is still `"object"`). None of these interactions are in `context.inc.d.ts:53-174`. Unknown options and a non-object `options` (`new Context("nope")`) are accepted without complaint.

### 6. bug: a Worker module's static imports bypass yavascript's loader

- API: `Worker` (`src/layer3/worker.ts`)
- Repro: `cd worker && ../y.sh main2.js ts` and `../y.sh main2.js import-worker`
- Expected: a worker file resolves and compiles its imports the same way a main script does.
- Actual: `ts-worker.ts` (`import { fromTs } from "../langs/lib-ts"`) fails with `Failed to resolve '../langs/lib-ts' ... (using search extensions: [".js"])`. `import-worker.js` (`import { fromTs } from "../langs/lib-ts.ts"`) fails with `invalid export syntax` because the `.ts` file is parsed as JS. Dynamic `import()` and `require()` inside the worker work (`../y.sh main2.js dynimport-worker` gives `dynamic import worked: ts:1 / coffee:2,4,6`).
- Cause: `worker.ts:77-86` prepends the layer 1/2 bootstrap to the worker module's own source. Static imports are linked before any of that code runs, so the module hooks, extension compilers and `searchExtensions` aren't installed yet.

### 7. bug: CommonJS detection is a regex over the raw source, so files that mention `module.exports` break

- API: module loading (`looksLikeCommonJS`, `src/layer1/cjs-interop.ts`)
- Repro: `./y.sh cjsdetect/comment-mention.js` (a comment containing `module.exports`, and `const exports = [...]`); `./y.sh langs/cjs-false-positive.js` (`const module = ...`, and a template string containing `module.exports`); `./y.sh cjsdetect/esm-string-mention.js`
- Expected: the files run normally.
- Actual: the first two fail with `SyntaxError: invalid redefinition of global identifier` at the user's `const exports` / `const module` line, exit 1. The ESM file whose only mention is inside a string runs, but gets `module` and `exports` bindings injected (`typeof module` prints `object`).
- Cause: `CJS_RE = /exports\.\w|module\.exports|Object\.defineProperty\(exports/` (`cjs-interop.ts:59-62`) also matches comments and strings; the wrapper then declares `const exports` and `const module` (`cjs-interop.ts:64-83`).

### 8. gap: ESM `import` of a CommonJS module doesn't work; only `require` understands the CJS wrapper

- API: module loading, cjs-interop
- Repro: `./y.sh repl/file-default.js`, `./y.sh interop/named-import.js`, `./y.sh interop/ns-import.js`, `cd nm && ../y.sh esm-import-cjs-pkg.js` (`langs/lib-cjs.js` is `module.exports = { a: 1, b: 2 };`; `nm/node_modules/pkg-cjs` uses `exports.value = ...`)
- Expected (Node semantics): `import x from "./lib-cjs.js"` or `import pkg from "pkg-cjs"` gives `module.exports`; ideally named imports work too.
- Actual: default import fails with `SyntaxError: Could not find export 'default' in module '.../lib-cjs.js'` (location `<internal>/quickjs.c:31164`, no user file or line); a named import fails with `Could not find export 'a'`; `import * as ns` and `await import(...)` give an object whose only keys are the internal `__cjsExports` and `__isCjsModule`. Since most `node_modules` packages are CJS, ESM code can't import them.
- Cause: `wrapCommonJSCode` (`cjs-interop.ts:64-102`) only exports `__isCjsModule` and `__cjsExports`, and only `patchRequire` (`cjs-interop.ts:23-37`) unwraps them.

### 9. bug: modules loaded over http(s) can't import their own relative or root-relative dependencies, and ignore import attributes

- API: module protocols (`src/layer1/module-protocols/http.ts`), `src/layer1/module-hooks.ts`
- Repro (light network use): `cd net && T=30 ../y.sh relative-url.js` and `T=40 ../y.sh url-attrs.js`
- Expected: `./_baseGetTag.js` imported from `https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/isSymbol.js` resolves against that URL; `/npm/is-number@6.0.0/+esm` imported from a jsdelivr module resolves against its origin; `with { type: "json" }` on a URL gives the parsed JSON as `default`.
- Actual:
  - `./_baseGetTag.js: Couldn't resolve module './_baseGetTag.js' from 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/isSymbol.js'` (the odd prefix is finding 16).
  - `is-odd FAILED: Failed to load module: No such file or directory (errno = 2, filename = /npm/is-number@6.0.0/+esm)`: the root-relative specifier is treated as a local absolute path (`module-hooks.ts:72-74`).
  - `https://cdn.jsdelivr.net/npm/ms@2.1.3/package.json` imported `with { type: "json" }` silently becomes a module with no exports (`keys: []`). `http.ts:29` always runs `compilers.autodetect` on the body, and `ModuleDelegate.read` (`module-hooks.ts:109-123`) never passes the attributes on for URLs.
  - Works: self-contained URL modules (`https://cdn.jsdelivr.net/npm/ms@2.1.3/+esm` gives `[ [ "default" ] 86400000 ]`), over `http://` too.
- Cause: `ModuleDelegate.resolve` (`module-hooks.ts:52-106`) only recognizes a URL when the specifier itself is absolute; for a URL `fromFile` it runs `dirname()`/`Path` on the URL and looks on the local filesystem.

### 10. bug: `require(path, { with: {...} })` ignores the import attributes

- API: `require` (documented at `meta/website/docs/modulesys.md:217-219`: "eg `require("./data.json", { with: { type: "json" } })`")
- Repro: `./y.sh -e 'require("./data/json-in.txt", { with: { type: "json" } })'` (`json-in.txt` contains `{ "fromTxt": true }`)
- Expected: `{ fromTxt: true }`, like `import("./data/json-in.txt", { with: { type: "json" } })` and the static `import ... with { type: "json" }` in `data/esm-attrs.js`, which both work.
- Actual: `SyntaxError: expecting ';'` at `json-in.txt:1:12`. The file is parsed as JS. `require.resolve` with the same options works.
- Cause: yavascript's `newRequire` (`src/layer1/cjs-interop.ts:10-22`) takes only `path` and calls `nativeRequire(resolved)`, dropping the second argument. Testing with a `.json` file hides this because the extension picks the JSON loader anyway.

### 11. bug: default import of a JSON, YAML, TOML or CommonJS module in the REPL or `-e` gives `undefined`

- API: REPL, CLI `-e` (`src/layer1/esm-to-require.ts`)
- Repro: `DEADLINE=5000 node drive.js 'import data from "./data/data.json"{cr}|data{cr}|import cj from "./langs/lib-cjs.js"{cr}|cj{cr}|{x04}'`
- Expected: `data` is `{ a: 1, b: [1, 2] }` (what the same import gives in a file, see `repl/file-default.js`), and `cj` is `{ a: 1, b: 2 }`.
- Actual: the REPL shows `-> data = require("./data/data.json").default` and prints `undefined` for both. A real ESM default export works (`import d from "./repl/esm-default.js"` gives `5`).
- Cause: `esm-to-require.ts:32` rewrites a default import as `require(x).default`, but the patched `require` (`src/layer1/cjs-interop.ts:23-37`) already unwraps `__isCjsModule` modules (the JSON/YAML/TOML templates in `src/layer1/extension-handlers/` and wrapped CJS) to their `module.exports` value, which has no `default`.

### 12. bug: imports typed into the TypeScript or TSX REPL are silently compiled away

- API: REPL with `--lang ts` / `--lang tsx` / `startRepl({}, "ts")`
- Repro: `DEADLINE=6000 node drive.js 'import { fromUtf8 } from "quickjs:encoding"{cr}|typeof fromUtf8{cr}|import * as enc from "quickjs:encoding"{cr}|typeof enc{cr}|{x04}' --lang ts` (and the same with `--lang tsx`)
- Expected: what the JS REPL does: `-> ({ fromUtf8 } = require("quickjs:encoding")); fromUtf8`, then `"function"`.
- Actual: `-> ` (empty), `undefined`, and both `typeof` checks give `"undefined"`.
- Cause: `compileLine` (`src/layer1/api/repl/js-repl.ts:27-30`) compiles with sucrase first; its TypeScript transform removes imports whose bindings aren't used in that same input, leaving nothing for `esmToRequire` to rewrite.

### 13. bug: a failing `\load` wedges the default REPL

- API: default REPL, `\load` directive
- Repro: `DEADLINE=4000 node drive.js '\load repl/throws{cr}|1+1{cr}|{x04}'` (`repl/throws.js` throws); a typo does the same: `DEADLINE=4000 node drive.js '\load repl/nope{cr}|2+2{cr}|{x04}'`
- Expected: the error is printed like any other REPL error, and a fresh prompt appears.
- Actual: the error prints with internal frames, no prompt returns, and each later line is glued onto the directive: `ReferenceError: could not load 'repl/throws1+1.js'`, `could not load 'repl/nope2+2.js'`. Ctrl+D no longer exits because the line isn't empty (the driver had to SIGKILL it); only Ctrl+C twice gets out.
- Cause: `handleDirective` (`src/layer1/api/repl/js-repl.ts:83-89`) calls `engine.runScript` outside `evalAndPrint`'s try/catch, so the throw escapes `preprocessLine` and hits the engine problem in finding 14. Also, `\load` isn't listed by `\h`, and it runs the file as a classic script with no compile step, so `\load repl/loadme.ts` fails on the type annotation.

### 14. bug: if `handleInput` throws, InteractivePrompt stops prompting and glues the next line onto the failed one

- API: `InteractivePrompt` (`src/layer1/api/repl/repl-engine.ts`)
- Repro: `DEADLINE=4000 node drive.js 'boom{cr}|after{cr}|{x04}' ip/throwing.js` (the handler throws on `"boom"`)
- Expected: the error propagates (non-zero exit), or the prompt recovers and reads `after` as a new line.
- Actual: stderr gets `Error: handler threw` plus internal `layer1.js` frames, no new prompt is printed, and the handler next receives `"boomafter"`. Exit code 0.
- Cause: `readlineHandleCmd` (`repl-engine.ts:843-846`) calls `handleAcceptedLine` and then `cmdReadlineStart`; a throw skips the restart, so `cmd` still holds `boom`. The same applies to throwing `prompt`, `printInput` and `getCompletions` callbacks. `getCompletions`'s return value isn't validated either: returning `undefined` (`drive.js 'ap{tab}|x{cr}|{x04}' ip/badcompl.js`) prints `TypeError: cannot read property 'candidates' of undefined` from `completion` (`repl-engine.ts:627-628`).

### 15. bug: a Worker file that starts with a shebang fails to load

- API: `Worker`
- Repro: `cd worker && ../y.sh main2.js shebang` (`shebang-worker.js` is `#!/usr/bin/env yavascript` plus one `postMessage` line)
- Expected: it runs, as the same kind of file does as a main script (`./y.sh langs/shebang.js` prints `shebang js ok`).
- Actual: `onerror: invalid first character of private name`.
- Cause: `src/layer3/worker.ts:77-86` joins the bootstrap statements and the compiled code with spaces, so `#!` is no longer at offset 0. `compilers.js` doesn't strip shebangs (`src/layer1/compilers.ts:94-106`); only the sucrase and CoffeeScript paths call `stripShebangs`.

### 16. bug: "Couldn't resolve module" errors have `err.name` overwritten with the module specifier

- API: module resolution (`import`, `import()`)
- Repro: `./y.sh errs/missing-import.js`; `./y.sh -e 'import("some-missing-package").catch(e => console.log(JSON.stringify({name: e.name, msg: e.message, isErr: e instanceof Error, keys: Object.keys(e)})))'`
- Expected: prints as `Error: Couldn't resolve module ...`, and `e.name === "Error"`.
- Actual: prints as `some-missing-package: Couldn't resolve module 'some-missing-package' from '...' (name = "some-missing-package", fromFile = ...)`; `e.name` is `"some-missing-package"` and the own keys are `["name","fromFile"]`. The printed location is `fileName: "yavascript-internals/dist/bundles/layer1.js"` rather than the importing line.
- Cause: `src/layer1/module-hooks.ts:99-105` passes `{ name, fromFile }` to `makeErrorWithProperties`, which `Object.assign`s them onto the Error (`src/layer1/error-with-properties.ts:40`).
- Related: `require()` of the same module throws a different message (`Cannot find module (request = "...", fromFile = "...")`, `src/layer1/cjs-interop.ts:15-19`) that throws away the resolver's error, and neither error has a `code` like Node's `MODULE_NOT_FOUND`.

### 17. doc-mismatch: `Worker.prototype.terminate()` doesn't terminate the worker thread

- API: `Worker.terminate` (`src/layer3/worker.inc.d.ts:80-83`: "Terminate the worker thread. Equivalent to setting `onmessage` to `null`.")
- Repro: `cd worker && T=4 ../y.sh terminate-forever.js` (the worker runs a `setInterval`; main calls `w.terminate()` 200ms after the first message)
- Expected (per "Terminate the worker thread"): the worker stops and the process exits.
- Actual: `main: terminate()` is logged, then `worker still alive, tick 10` ... `tick 70` keep printing until the 4s alarm kills the process (exit 142). Only the second sentence of the doc is true. There is no API that actually stops a worker, so a stuck worker or `runInWorker` function can't be cancelled and keeps the process alive.

### 18. doc-mismatch: `StructuredClonable` lists types that `postMessage` refuses

- API: `Worker.postMessage`, `StructuredClonable` (`src/layer3/worker.inc.d.ts:86-112`), `runInWorker` doc (`runInWorker.inc.d.ts:28-33`)
- Repro: `cd worker && ../y.sh clonable.js`; `../y.sh main.js regexp`, `../y.sh main.js err`, `../y.sh main.js sym`
- Expected: every type in the union, plus the runInWorker doc's "instances of native Error constructors", can be posted.
- Actual: `DataView`, `RegExp` and `Error` throw `TypeError: attempting to serialize unsupported object class: DATAVIEW` / `REGEXP` / `ERROR`. A Symbol gives the cryptic `InternalError: unsupported tag (-8)`. Works: `Boolean`/`String` wrappers, `SharedArrayBuffer`, `Date`, bigint, typed arrays, `undefined`, plain and nested objects. Class instances and `Path` arrive as plain objects with the prototype lost, which the doc doesn't mention.

### 19. gap: Node-style package resolution is missing `exports`, extensionless `main`, `.cjs`, `.mts`/`.cts`

- API: module resolution (`src/layer1/module-hooks.ts`), extension handlers
- Repro: `cd nm && ../y.sh main.js` and `../y.sh ext.js`; `cd data && ../y.sh cjs-json.js`
- Actual:
  - `require("pkg-exports")` and `require("pkg-exports/sub")` (a package with only an `exports` map): `Cannot find module`. `exports` is never read.
  - `require("pkg-main-noext")` (`"main": "lib/index"`): `Cannot find module`. `potentialFilesForPath` (`module-hooks.ts:32-46`) accepts `main` only if it names an existing file exactly.
  - `require("./file.cjs")` (`module.exports = ...`): `ReferenceError: 'module' is not defined`. There's no `.cjs` compiler, so the CJS wrapper is never applied.
  - `require("./file.mts")`: `SyntaxError: missing initializer for const variable`. No `.mts`/`.cts` compilers.
  - `require("./data")` doesn't find `data.json` (`.json` isn't in `searchExtensions`).
  - `require.main` is `undefined`.
  - Works: `main` naming a full filename, `.mjs`, CJS packages requiring relative files, `__dirname`/`__filename`/`module.id` inside CJS, module instance caching.

### 20. gap: `node:process` has no named exports, and `process` lacks the Node members scripts use most

- API: node-compat (`src/layer1/api/node-compat/node-compat.ts`)
- Repro: `cd node && ../y.sh esm-process-named.js`, `../y.sh esm-process.js`, `../y.sh proc.js a b`; `./y.sh -e 'const r = {}; for (const m of ["fs", "path", "os", "child_process", "util", "events", "node:path", "buffer", "process", "node:process"]) { try { require(m); r[m] = "ok" } catch (e) { r[m] = e.message.split(" (")[0] } } JSON.stringify(r)'`
- Actual:
  - `import { argv, env } from "node:process"` fails with `SyntaxError: Could not find export 'argv' in module 'node:process'`; `(await import("process")).argv` is `undefined`; `import * as ns from "process"` has keys `__cjsExports`, `__isCjsModule`, `default`. Only the default import works (`node-compat.ts:66-72`).
  - `process.stdout`, `stderr`, `stdin`, `cwd()`, `chdir()`, `pid`, `nextTick`, `on`, `hrtime`, `uptime`, `memoryUsage`, `kill` are all missing: `process.stdout.write("x")` throws `TypeError: cannot read property 'write' of undefined`, `process.cwd()` throws `TypeError: not a function`.
  - `require("fs")`, `"path"`, `"os"`, `"child_process"`, `"util"`, `"events"`, `"buffer"` and `node:` variants throw a bare `Cannot find module`, with no hint toward yavascript's equivalents.
  - The doc does say "a subset", hence gap, but `process.stdout.write`, `process.cwd()` and named imports from `node:process` are the first Node-isms a ported script hits. Also, `process.exit` is declared as returning `void` rather than `never` (`node-compat.inc.d.ts:45`).

### 21. gap: no top-level `await` (or `import.meta`) in `-e` or the REPL

- API: CLI `-e`, REPL
- Repro: `./y.sh -e 'await Promise.resolve(5)'`; `DEADLINE=5000 node drive.js 'await Promise.resolve(5){cr}|Promise.resolve(6){cr}|{x04}'`; `./y.sh -e 'import.meta.url'`
- Actual: `SyntaxError: expecting ';'` in both `await` cases, and a promise result prints as `Promise {}` with no state or value, so an async result can't be seen at the prompt without `.then(console.log)`. `import.meta` gives `SyntaxError: import.meta only valid in module code`. Files do support top-level await (`errs/tla-throw.js`); `-e` and the REPL use `engine.evalScript` (`src/layer5b/targets/eval.ts:17-20`, `js-repl.ts:117-120`). Many yavascript APIs have async variants, so this is a notable gap for 1.0.

### 22. gap: there's no way to run a script from stdin

- API: CLI
- Repro: `./y.sh -`; `IN='console.log("from stdin", 1 + 1)\n' ./y.sh /dev/stdin`; `perl -e 'alarm 5; exec @ARGV' ../../../dist/yavascript /dev/stdin < stdin-script.js`; `cat stdin-script.js | CLICOLOR=0 HOME=$PWD/home perl -e 'alarm 3; exec @ARGV' ../../../dist/yavascript | cat -v`
- Expected: some documented way to do `curl ... | yavascript` or `yavascript - < script.js`, like `node -`, `bash -s`, `deno run -`.
- Actual: `-` gives `Error: No such file or directory (errno = 2, path = .../-)`. `/dev/stdin` from a pipe gives `Failed to load module: Illegal seek (errno = 29, filename = /dev/fd/0)`; from a file redirect it resolves to a nonexistent path (`filename = /dev/fd/stdin-script.js`). Piping into bare `yavascript` feeds the script through the REPL line by line: every character is echoed followed by `ESC[J`, `> ` prompts and `undefined` results are mixed into the output, and at EOF it spins forever (finding 2).

### 23. gap: InteractivePrompt can't be stopped from code, doesn't report that it stopped, and doesn't wait for an async `handleInput`

- API: `InteractivePrompt` (`src/layer1/api/repl/interactive-prompt.ts:58-75`)
- Repro: `DELAY=600 DEADLINE=4000 node drive.js 'one{cr}|two{cr}|{x04}' ip/async-handler.js` (handler: `async (input) => { await sleep.async(200); console.log("finished handling:", input) }`)
- Actual: output is `async> one`, `async> finished handling: one`, `two`, `async> finished handling: two`. The next prompt is printed as soon as `handleInput` returns its promise, so the handler's output lands after the prompt and the user can type while it is still running.
- Also: `start()` throws away the engine handle that has `stop()` (`repl-engine.ts:878-884`), so instances have no `stop()`/`close()` (`typeof p.stop` is `undefined` in `ip/basic.js`), and there's no callback or promise for "the user pressed Ctrl+D". Double Ctrl+C always calls `exit(0)` (`repl-engine.ts:138`), so a program can't clean up or pick its exit code (shells use 130). These are what a confirm prompt or a multi-step wizard needs.

### 24. rough-edge: REPL multi-line handling is JS-only, and directives are processed on continuation lines

- API: default REPL (`src/layer1/api/repl/js-repl.ts`)
- Repro (the second command types a backslash followed by `tsecond`):

```sh
DEADLINE=6000 node drive.js 'square = (x) ->{cr}|  x * x{cr}|square 4{cr}|{x04}' --lang coffee
DEADLINE=6000 node drive.js 'const s = `first{cr}|\tsecond`{cr}|JSON.stringify(s){cr}|{x04}'
```

- Actual:
  - CoffeeScript: `square = (x) ->` is evaluated at once as `square = function(x) {}`, then `  x * x` runs alone (`ReferenceError: 'x' is not defined`), and `square 4` returns `undefined`. Indentation-based blocks can't be entered in the Coffee or Civet REPLs, because completeness comes from the JS colorizer's bracket balance (`js-repl.ts:150-157`).
  - Inside an unterminated template literal, a continuation line starting with `\` is taken as a directive: `Unknown directive: tsecond`, the line is dropped, and the REPL stays inside the template. A continuation line that is exactly `?` prints help instead. `preprocessLine` (`js-repl.ts:159-172`) runs on every line, continuation lines included.

### 25. rough-edge: the REPL can't start if its config dir can't be created

- API: default REPL, `InteractivePrompt` with `historyFileName` (`src/layer1/api/repl/history-file.ts`)
- Repro: `YS_HOME=/dev/null DEADLINE=4000 node drive.js '1+1{cr}|{x04}'` and `YS_HOME=/dev/null DEADLINE=4000 node drive.js 'x{cr}|{x04}' ip/basic.js hist.txt`
- Expected: `interactive-prompt.inc.d.ts:97-100` says that when there's nowhere to write, history is kept for the session only.
- Actual: `Error: Cannot use mkdir to create directory '/dev/null/Library/Application Support/yavascript' because '/dev/null' is a file, not a directory.` and exit 1 before any prompt. Only an unset `HOME` falls back to session history; an unwritable one (read-only containers, `HOME=/`) makes the REPL unusable. The `HistoryFile` constructor (`history-file.ts:13-27`) doesn't catch `mkdir`/`touch` failures.

### 26. rough-edge: Worker globals differ from the main thread, contrary to the doc

- API: `Worker` (`src/layer3/worker.inc.d.ts:1-10`: "loads all of the YavaScript API globals into the Worker's global context")
- Repro: `cd worker && ../y.sh main.js globals`, `../y.sh main2.js nested`, `../y.sh leak-main.js`, `../y.sh main2.js missing`, `../y.sh main2.js undefined-options`
- Actual:
  - Inside a worker, `typeof runInWorker` and `typeof Context` are `"undefined"`; `Worker` is the raw `quickjs:os` Worker (`Worker === require("quickjs:os").Worker` is `true`); `new Worker(...)` throws `TypeError: cannot create a worker inside a worker`; `scriptArgs` (and so `process.argv`) is `[]`. None of this is documented.
  - `__yavascript_layer1_internals` and `__yavascript_layer2_internals` stay on the worker's global (enumerable), though the main thread deletes them (crosscut report #20 covers the main-thread leaks). Cause: the worker bootstrap (`src/layer3/worker.ts:77-86`) only runs layers 1 and 2 and never cleans up.
  - `new Worker("./does-not-exist.js")` throws `Error: Failed to normalize module name`, without the path.
  - `new Worker(file, undefined)` throws `TypeError: cannot read property 'overrideCode' of undefined`, though `options` is optional in the type (`worker.ts:42-43` checks `args.length`).

### 27. doc-mismatch: InteractivePrompt `printInput` output must be exactly as wide as the input

- API: `InteractivePrompt` `printInput` (`interactive-prompt.inc.d.ts:70-80`: "so that you can colour it or mark it up")
- Repro: `RAW=1 DEADLINE=4000 node drive.js 'ab{cr}|{x04}' ip/printinput.js` (`printInput` writes `"<" + input.toUpperCase() + ">"`)
- Actual raw stdout: `[1]> <A>` `ESC[J` `ESC[D` `<AB>` `ESC[J`. After drawing `<A>` (3 columns), the engine moves left 1 column (the input's length) before redrawing, so a terminal shows `[1]> <A<AB>` with the cursor in the wrong place. Only zero-width markup (ANSI colors) works. Cause: `update()` (`repl-engine.ts:278-320`) computes cursor columns from `cmd`, not from what `printInput` wrote.

### 28. rough-edge: REPL Tab completion evaluates getters and prints their exceptions

- API: default REPL completion (`src/layer1/api/repl/js-completions.ts`)
- Repro: `DEADLINE=5000 node drive.js 'cp.{tab}|1+1{cr}|{x04}'`; `DEADLINE=6000 node drive.js 'globalThis.bad = { get boom() { throw new Error("getter threw") } }; 0{cr}|bad.boom.{tab}|2+2{cr}|{x04}'`
- Expected: nothing happens when there's no object to complete against. The comment on `evalForCompletion` (`js-completions.ts:27-32`) says unresolvable names must not escape and print a stack trace over the line.
- Actual: Tab prints `ReferenceError: 'cp' is not defined. Did you mean 'copy'?` (the stub global's getter) or `Error: getter threw`, each with 9 internal frames, over the line being edited. Cause: `getContextObject` reads `obj[base]` directly (`js-completions.ts:85-89`), outside the try/catch. `suffixForCandidate` (`js-completions.ts:181-190`) also runs getters on a double Tab.

### 29. rough-edge: `with { type }` names and behavior don't line up with `--lang` or with extension loading

- API: import attributes, extension handlers (`src/layer1/extension-handlers/`)
- Repro: `cd data && ../y.sh attr-types.js`; `./y.sh -e 'import("./data/data.txt", { with: { type: "bogus" } }).then(m => console.log(Object.keys(m)), e => console.log("rejected:", e.message))'`
- Actual:
  - `import("./commented.json")` works (yavascript loads `.json` as JSON5), but the same import `with { type: "json" }` fails with `SyntaxError: unexpected token: '/'`, because `type: "json"` goes to QuickJS's strict loader (`extension-handlers/json.ts:19` leaves it in place). Adding the standard attribute breaks a file that loads without it. The two loaders also produce differently shaped modules (only the `.json` one has the `__cjsExports` marker `require` uses).
  - `type: "typescript"` and `type: "coffeescript"` work, but `type: "ts"` and `type: "coffee"` (both valid `--lang` values) aren't registered (`extension-handlers/ts.ts:8`, `coffee.ts:9`).
  - An unregistered `type` (`"ts"`, `"coffee"`, `"bogus"`) is silently ignored and the file is parsed as JS, so the error is a misleading `SyntaxError` (`missing initializer for const variable`, `expecting ';'`) rather than "unsupported import type".
  - `import * as ns from "./data.json"` exposes the internal `__cjsExports` and `__isCjsModule` keys next to `default`.

### 30. doc-mismatch: yavascript's module resolution rules aren't documented anywhere

- API: module system
- Repro: `./y.sh order/main.js` (a directory with both `x.js` and `x.ts`; `import x from "./x"` prints `from ts`); `./y.sh -e 'require("quickjs:engine").ModuleDelegate.searchExtensions'` gives `[".civet", ".ts", ".tsx", ".coffee", ".jsx", ".js"]`
- The only resolution doc is QuickJS's `modulesys.md`, which says `searchExtensions` "Defaults to `[".js"]`" (`meta/website/docs/modulesys.md:34`) and that `.json` isn't loaded by extension alone (`:75-83`). In yavascript, extensionless imports prefer `.civet`/`.ts`/`.tsx`/`.coffee`/`.jsx` over `.js` (`src/layer1/extension-handlers/_load-all.ts:16-23`); `.json` loads by extension as JSON5; `.yaml`/`.yml`/`.toml` load by extension; `node_modules` is searched using `main` but not `exports` (finding 19); CommonJS is detected heuristically (finding 7); `require` unwraps CJS but `import` doesn't (finding 8). The README's "Languages" section (`README.md:116-124`) names the languages and nothing else.

### 31. rough-edge: missing-file and compile errors show raw errno text and internal stack frames

- API: CLI run-file target
- Repro: `./y.sh nonexistent.js`, `./y.sh --help extra`, `./y.sh langs` (a directory), `./y.sh -r nope.js -e 1`, `./y.sh langs/bad2.ts`
- Actual:
  - `Error: No such file or directory (errno = 2, path = /.../nonexistent.js)` followed by 7 frames such as `at <internal>/quickjs-os.c:1011:0` and `at runFileTarget (yavascript-internals/dist/bundles/layer5b-arm64.js:28836:26)`. A directory gives `Failed to load module: Input/output error (errno = 5, ...)`. `--help extra` tries to run a file named `--help`. All exit 1, while the `invalid` target uses 3. Cause: `realpath` in `src/layer5b/targets/run-file.ts:43` throws straight into `runMain`'s `printError`.
  - A TS compile error prints `SyntaxError: Error transforming .../bad2.ts: Unexpected token (2:14)`, then 34 sucrase frames and `fileName: "yavascript-internals/dist/bundles/layer1.js"`, with no frame at the user's file. The plain-JS equivalent (`langs/bad2.js`) prints `at .../bad2.js:2:14`. Message formats per compiler are already covered by formats report #28.

### 32. rough-edge: `yavascript -v` / `--version` print no trailing newline

- API: CLI
- Repro: `./y.sh -v | od -c | head -2`
- Actual: `git-3eedd831a85c` is immediately followed by the next output (`[exit=0]`), so a shell prompt lands on the same line. `--help`, `--license` and `--print-types` all end in `\n`. Cause: `std.out.puts(version)` (`src/layer5b/targets/version.ts:8`).

### 33. question: `yavascript -- script.js` opens the REPL and ignores the file

- API: CLI (`src/layer5b/determine-target.ts:93-96, 122-124`)
- Repro: `T=3 ./y.sh -- args.js x` prints `> ` and hangs (finding 2), exit 142.
- Question: this is snapshotted as intended (`meta/tests/src/determine-target.test.ts:46-47`: `["--", "-v"]` is `repl`), but `node -- file.js` and similar CLIs run the first argument after `--`. Someone writing `yavascript -- "$script" "$@"` defensively gets a REPL, and in CI a hang. Related, already reported by the exec agent (F3): `--lang` is also consumed after a script filename, so user scripts can't accept a `--lang` flag (`./y.sh args.js --lang potato` exits 3 with `Invalid --lang`).

### 34. question: an unsettled top-level `await` exits 0 silently

- API: module evaluation
- Repro: `cd errs && ../y.sh tla-never.js` (`console.log("before"); await new Promise(() => {}); console.log("after");`)
- Actual: prints `before` and exits 0; `after` never runs. Node exits with code 13 and prints "Warning: Detected unsettled top-level await". Together with finding 1, a script can skip the rest of its work and still report success.

### Already-reported issues seen again (not re-investigated)

- `--lang ts -e` with statements fails because of `expression: true` (formats #27). The same happens for `--lang civet -e 'x := 3'` (`SyntaxError: Unexpected token (1:2)`).
- stdout is written after stderr when both are pipes (every `errs/*.js` run shows `before` after the error).
- `runInWorker` doc example without `await` prints `Promise {}` (`worker/doc-example.js`).
- `new Worker("./virtual.ts", { overrideCode })` with a nonexistent relative name fails (`worker/main2.js override-ts`, `override-noext`).
- `process.version` is `v16.19.0`; no `fetch`/`URL`/`Buffer`/`queueMicrotask`/`setImmediate`/`atob` (`node/proc.js`).
- `startRepl` context goes onto `globalThis` (`ip/startrepl.js`: `typeof myVar` is `"number"` at the prompt).

## Verified working

- CLI flags: `-v`, `--version`, `-version`, `-h`/`--help` (no ANSI when piped), `--license`, `--print-types` all exit 0. Missing arguments (`-e`, `--lang`, `-r`) and `--lang potato` print a message plus a `--help` hint and exit 3. `--lang js file a b` forwards `a b`; `-r file -e code` and `-r throw.ts -e ...` preload first; `--lang coffee file.txt` and `--lang ts file.js` compile with the chosen language.
- `-e`: expressions and statement lists (`const x = 1; x + 1` gives `2`), `null`, strings, objects, `function f() {}` (prints nothing), multi-line `--lang coffee`, `--lang jsx`/`tsx` expressions, `__filename` (`<cwd>/<evalScript>`), single-line imports alone, sync throw and `Promise.reject` exit 1.
- Exit codes: sync throw 1, unhandled rejection 1 (including from an async function), `process.exitCode = 7` gives 7, syntax error 1, `throw "a string"` prints `Non-error value was thrown` and exits 1, `Error` `cause` is printed, top-level await works and a throw after it exits 1, a rejection handled after an `await` doesn't count as unhandled.
- Languages: `langs/main.ts` imports JS, TS (enum, `import type`), JSX, TSX, CoffeeScript and Civet; `main.coffee` and `main-civet.civet` import across languages; TS imports YAML/TOML; shebang lines in `.js` and `.civet` main scripts; UTF-8 BOM in `.js`/`.ts`; CRLF line endings.
- Stack traces point at the user's source lines for TS (`throw.ts:10:18`), TSX (`throw.tsx:5:18`), JSX (`throw.jsx:7:18`), CoffeeScript (`throw.coffee:4:9`, and across files in `imports-throw.ts`), and Civet (`throw2.civet:2:18`).
- `import.meta`: `url` (`file://...`), `main` (true in the entry, false in imports), `require`, `resolve`, `attributes` (`undefined` without `with`); `__filename`/`__dirname` in TS.
- Import attributes: static `with { type: "json" }` on a `.txt` file, dynamic `import(..., { with })`, `require.resolve(..., { with })`; `.json`/`.json5`/`.yaml`/`.toml` by extension (import and require).
- `require`: relative CJS, instance caching, `__dirname`/`__filename`/`module.id` in CJS, `require("process")`/`require("node:process") === process`; `.mjs` files and packages whose `main` is a full filename.
- URL modules: self-contained `https://` and `http://` modules (`ms@2.1.3/+esm`).
- `Worker`: messages in both directions, `initialData`, `onerror` for a throw and for a rejection in the worker (with `message`, `filename`, `lineno`, `error`), `exit()` in a worker gives a clear error, dynamic `import()`/`require()` of TS/Coffee inside a worker, `overrideCode` with an absolute nonexistent filename (`import.meta.url` matches), wrong argument count throws a clear error.
- `runInWorker`: sync and async return values, `require` inside the function resolves relative to the caller's file, yavascript globals inside, `throw "string"` from an async function rejects.
- `Context`: `eval`, separate `globalThis`, yavascript globals by default, `yavascriptGlobals: false`, nested `Context`, `console.log` inside, syntax and runtime errors thrown to the caller, absolute `require` (JS and TS), dynamic `import()`, timers inside a context fire; with `yavascriptGlobals: false`, the `date`, `mapSet`, `timers`, `inspect`, `print`, `regExp`, `proxy`, `typedArrays`, `json` and `stringNormalize` options each remove what they say; no `scriptArgs` inside, as documented.
- REPL: single-line JS imports, ESM default imports, `startRepl` with context and `NOTHING`, `startRepl` with an invalid lang throws a clear error, Civet `x := 3`, `\h`, `\t`, `\load` of a valid JS file, TS `<Type>value`.
- `InteractivePrompt`: lines, custom prompt, Tab completion and double-Tab listing, `historyFileName` written and recalled with Up in a later session, Ctrl+D and double Ctrl+C exit.
- Node compat: `global === globalThis`; `process.version`, `versions`, `arch`, `platform`, `env` (same object as `env`; writes reach child processes; numbers become strings), `argv`, `argv0`, `execPath`, `exitCode`; default import of `process` and `node:process`.

## Test coverage notes

- `meta/tests/src/runInWorker.test.ts:44-62` ("function rejects") locks in finding 1: it passes because the worker's own error print matches the snapshot, not because the promise rejected. A test that distinguishes the two (`.then(() => print("resolved"), () => print("rejected"))`) would fail today. Nothing tests async rejection with an Error, non-clonable return values, or closures.
- `meta/tests/src/repl.test.ts:1519-1535` ("import statements are rewritten to require calls") imports `basename` from `quickjs:os`, which has no such export, so the snapshot shows `undefined` and would still pass if imports did nothing. There's no REPL import test for `--lang ts`/`tsx` (finding 12), for default imports of JSON/CJS (finding 11), or for multi-line `-e` with an import (finding 3).
- Nothing closes stdin: `startReplSession` in `meta/tests/src/repl-helpers.ts` always ends with Ctrl+D or Ctrl+C, so the EOF spin (finding 2) is invisible, and a test that forgot to exit would hang.
- No tests for a throwing `handleInput`/`getCompletions` (finding 14), `\load` at all (finding 13), directives inside continuation lines or multi-line Coffee/Civet (finding 24), unwritable config dirs (finding 25), async `handleInput` (finding 23), or `printInput` output wider than the input (finding 27).
- `meta/tests/src/worker.test.ts` has no worker that uses static imports of TS or extensionless paths (finding 6), a shebang (finding 15), `terminate()` on a busy worker (finding 17), non-clonable payloads (finding 18), nested workers, or checks for `runInWorker`/`Context` inside workers (finding 26).
- `meta/tests/src/context.test.ts` tests all-default options, every option off together with `yavascriptGlobals: false`, and `eval: false` alone. No other option is tested together with the default yavascript globals (finding 5), so neither the constructor errors nor the exit-time abort are covered.
- No test asserts the exit code for an exception in a timer, a worker message handler, or an unsettled top-level await (findings 4, 34).
- `meta/tests/src/cjs-interop.test.ts` only checks that CJS is detected; no false-positive case (finding 7) and no ESM `import` of a CJS file (finding 8).
- No fixture has a `node_modules` directory or a `package.json`, so package resolution (`main`, `exports`, index files) is untested (finding 19). No `.cjs`/`.mts` fixtures.
- `meta/tests/src/import-attributes.test.ts` only covers static `import ... with { type }` on extensionless fixtures (`meta/tests/fixtures/import-attributes/`). `require(..., { with })` (finding 10), dynamic `import(..., { with })`, `type: "json"` on a JSON5 file, and unknown `type` values (finding 29) are untested.
- Module protocols (`http:`, `https:`, `npm:`) have no tests at all, including relative imports inside URL modules (finding 9).
- No test for `node:process` named imports or for `process` members beyond the snapshot of globals (finding 20).
- No CLI test for `yavascript -`, stdin piping (finding 22), a missing script file (finding 31), or the `-v` output bytes (finding 32).
