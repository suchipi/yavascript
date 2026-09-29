# API audit: runtime, modules, CLI

Area: Layer 3 (`Worker`, `runInWorker`, `Context`), REPL (`InteractivePrompt`, `startRepl`, default REPL), Node compat (`global`, `process`), module system, languages, and the CLI.

Every result below comes from a command run against the current `./dist/yavascript` (`git-d8cc554c0810`, arm64 macOS), always under `timeout`. Sandbox files live in `.tmp/gap-update/runtime/`, and repro commands are run from that directory unless they `cd` somewhere else.

Helpers (both in the sandbox):

- `y.sh` runs the binary under `timeout` (default 10s, `T=` to change), `HOME` set to `runtime/home`, `CLICOLOR=0`, stdin from `/dev/null` (or piped from `IN='printf-format'`), and prints `[exit=N]`. Exit 124 means the timeout fired, i.e. a hang.
- `drive.js` is a pipe-based driver in the same style as `meta/tests/src/repl-helpers.ts`: it keeps stdin open, writes `|`-separated chunks 300ms apart (`DELAY=` to change; `{cr}`, `{tab}`, `{esc}`, `{x04}` etc. are key bytes), and SIGKILLs at `DEADLINE` ms. `YS_FOO=bar` sets `FOO` in the child's env; `RAW=1` shows escape codes.

## Summary

| # | Severity | API | Summary |
| --- | --- | --- | --- |
| 1 | bug | `-e`, REPL | An import followed by code on its line, by trailing whitespace, or by a line starting with `[`/`(` breaks |
| 2 | bug | `Context` | `modules: { "quickjs:bytecode": false }` fails with a file error; `console: false` is ignored; bad options are accepted |
| 3 | bug | REPL `\load` | Errors print to stderr with internal frames; no compile step; missing from `\h` |
| 4 | bug | module resolution | Errors point at yavascript's internals; `require` discards the resolver's error; no `code` |
| 5 | bug | URL modules | A `.json` or `.yaml` URL loads as an empty module unless the import has `with { type }` |
| 6 | doc-mismatch | `Worker.terminate` | Doesn't terminate the thread; a busy worker keeps the process alive forever |
| 7 | doc-mismatch | `StructuredClonable` | `RegExp`, `DataView`, `Error` are listed but rejected |
| 8 | gap | module interop | No named imports from CJS; no `exports`, extensionless `main`, `.cjs`, `.mts`/`.cts` |
| 9 | gap | node-compat | No named exports from `node:process`; no `process.stdout`/`cwd`/`on`/... |
| 10 | gap | `-e`, REPL | No top-level `await` or `import.meta` |
| 11 | gap | CLI | No way to run a script from stdin |
| 12 | gap | `InteractivePrompt` | No `stop()`, no end callback, async `handleInput` not awaited |
| 13 | rough-edge | REPL | Multi-line is JS-only (Coffee/Civet blocks impossible); directives run on continuation lines |
| 14 | rough-edge | REPL | Can't start when the config dir can't be created |
| 15 | rough-edge | `Worker` | Worker globals differ from main (no `runInWorker`/`Context`, leaked internals), undocumented |
| 16 | doc-mismatch | `InteractivePrompt.printInput` | Output must match the input's width |
| 17 | rough-edge | REPL completion | Tab evaluates getters and prints their exceptions |
| 18 | rough-edge | import attributes | `type` names differ from `--lang`; unknown types silently ignored |
| 19 | doc-mismatch | module system | yavascript's resolution rules aren't documented anywhere |
| 20 | rough-edge | CLI | Missing-file and compile errors show errno text and internal frames |
| 21 | rough-edge | CLI | `-v` prints no trailing newline |
| 22 | question | CLI | `yavascript -- script.js` opens the REPL |
| 23 | question | module evaluation | Unsettled top-level `await` exits 0 silently |

## Findings

### 1. bug: an import in `-e` or REPL input breaks when code follows it on the same line, after trailing whitespace, or on a line starting with `[` or `(`

- API: CLI `-e`, REPL (`src/layer1/esm-to-require.ts`)
- Repro: `./y.sh -e 'import { getcwd } from "quickjs:os"; typeof getcwd'` (the REPL does the same); `./y.sh -e $'import * as os from "quickjs:os"; \ntypeof os'` (a space after the `;`); `./y.sh -e $'import cj from "./langs/lib-cjs.js";\n[cj.a, cj.b]'`; `./y.sh -e $'import * as os from "quickjs:os";\n(typeof os)'`
- Expected: each runs as it would in a module (`typeof getcwd` is `"function"`, `[cj.a, cj.b]` is `[1, 2]`, and so on).
- Actual:
  - The first two aren't rewritten at all and fail with `SyntaxError: expecting '('`. An import line only matches when nothing but `;` follows it, so trailing whitespace (common in pasted code) is enough to stop the rewrite.
  - In the last two the rewrite swallows the import's own `;`, so the next line continues the rewritten expression: `[cj.a, cj.b]` becomes a property access on the `require(...)` call (`ReferenceError: 'cj' is not defined`), and `(typeof os)` becomes a call on it (`TypeError: not a function`).
  - An import on its own line followed by any other kind of line works.
- Cause: `stmt` (`esm-to-require.ts:18`) anchors each import to a whole line and ends it with `[;\s]*`, but inside that template literal `\s` is just `s`, so the tail matches only `;` (and `s`) before `$`. `transform` (`esm-to-require.ts:86-97`) adds a `;` in front of a replacement that starts with `(`, never after one. `evalTarget` (`src/layer5b/targets/eval.ts:13`) and the REPL's `compileLine` (`src/layer1/api/repl/js-repl.ts:27-29`) pass the entire input through it.

### 2. bug: `new Context({ modules: { "quickjs:bytecode": false } })` fails with a file error, `console: false` is ignored, and invalid options are accepted

- API: `Context` (`src/layer3/context.ts`, `context.inc.d.ts`)
- Repro: `./y.sh -e 'try { new Context({ modules: { "quickjs:bytecode": false } }) } catch (e) { console.log("caught:", e.message) }'`; `./y.sh -e 'new Context({ console: false }).eval("typeof console")'`; `./y.sh -e 'new Context({ bogus: 1 }); new Context("nope"); "accepted"'`
- Expected: with the default `yavascriptGlobals: true`, an option the globals can't be built without is rejected up front with a message naming the conflict, the way `date`, `promise` and `moduleGlobals` are; an option that gets overridden is documented; unknown or non-object options are rejected.
- Actual: `caught: Failed to load module: No such file or directory (errno = 2, filename = quickjs:bytecode)`. With `console: false`, `typeof console` is still `"object"`; adding `yavascriptGlobals: false` makes it `"undefined"`. `{ bogus: 1 }` and `"nope"` are accepted without complaint. None of these interactions are in `context.inc.d.ts:53-174`, and neither is the rule that `date`, `promise` and `moduleGlobals` can't be disabled while `yavascriptGlobals` is on.
- Cause: the up-front check (`context.ts:19-28`) covers only `date`, `promise` and `moduleGlobals`, but loading the yavascript globals also requires `quickjs:bytecode` inside the new context (`context.ts:36-43`), and layer 1 installs its own `console`.

### 3. bug: a failing `\load` prints its error differently from other REPL errors, and `\load` has no compile step

- API: default REPL, `\load` directive
- Repro: `DEADLINE=4000 node drive.js '\load repl/throws{cr}|1+1{cr}|{x04}'` (`repl/throws.js` throws); a typo: `DEADLINE=4000 node drive.js '\load repl/nope{cr}|2+2{cr}|{x04}'`; `DEADLINE=4000 node drive.js '\load repl/loadme.ts{cr}|{x04}'`
- Expected: the error is printed like any other REPL error, and a file in any language yavascript runs can be loaded.
- Actual: the prompt comes back, but the error goes to stderr followed by 9 of yavascript's own frames (`at runScript (native)`, `at handleDirective (yavascript-internals/dist/bundles/layer1.js:...)`, ... `at termReadHandler (...)`), where an error typed at the prompt goes to stdout with only the user's frames. The typo gives `ReferenceError: could not load 'repl/nope.js'` the same way. `\load repl/loadme.ts` fails with `SyntaxError: missing initializer for const variable` on the type annotation. `\load` isn't listed by `\h`.
- Cause: `handleDirective` (`src/layer1/api/repl/js-repl.ts:82-88`) calls `engine.runScript`, which runs the file as a classic script, outside `evalAndPrint`'s try/catch (`js-repl.ts:105-134`), so the throw is caught by the engine's fallback in `readlineHandleCmd` (`src/layer1/api/repl/repl-engine.ts:883-891`), which prints it to stderr in full. `help` (`js-repl.ts:66-76`) leaves `\load` out.

### 4. bug: module resolution errors point at yavascript's internals, and `import` and `require` report the same failure differently

- API: module resolution (`import`, `import()`, `require`)
- Repro: `./y.sh errs/missing-import.js`; `./y.sh -e 'try { require("some-missing-package") } catch (e) { console.log(JSON.stringify({ name: e.name, msg: e.message, keys: Object.keys(e), code: e.code })) }'`
- Expected: the printed location is the importing line, `require` passes on the resolver's message, and both errors carry a `code` like Node's `MODULE_NOT_FOUND`.
- Actual: `errs/missing-import.js` prints `Error: Couldn't resolve module 'some-missing-package' from '.../missing-import.js' (moduleName = ..., fromFile = ...)` with `at makeErrorWithProperties (yavascript-internals/dist/bundles/layer1.js:3096:35)` and `fileName: "yavascript-internals/dist/bundles/layer1.js"`, and no frame at the import. `require()` of the same name throws `Cannot find module (request = "some-missing-package", fromFile = "...")`, with own keys `request` and `fromFile`, which throws away the resolver's error. Neither has a `code`.
- Cause: `ModuleDelegate.resolve` throws from inside yavascript (`src/layer1/module-hooks.ts:138-144`); `newRequire` catches that and throws its own error instead (`src/layer1/cjs-interop.ts:13-20`).

### 5. bug: a `.json` or `.yaml` module loaded from a URL is silently empty unless the import has `with { type }`

- API: `http:`/`https:` module protocols (`src/layer1/module-protocols/http.ts`, `https.ts`)
- Repro: serve `url-data/` (`data.json` is `{"a": 1}`, `data.yaml` is `a: 1`) with `python3 -m http.server 0 --bind 127.0.0.1`, then `./y.sh -e 'import("http://127.0.0.1:PORT/data.json").then(m => console.log(JSON.stringify(Object.keys(m)), JSON.stringify(m.default)))'`
- Expected: the same as a local `.json` import, where `default` is `{"a":1}` without any attribute.
- Actual: `[] undefined`, exit 0, with no error or warning. `data.yaml` gives the same. With `{ with: { type: "json" } }` the `.json` URL gives `{"a":1}`. A `.ts` URL loads correctly, because autodetect compiles it.
- Cause: `readModule` (`http.ts:33-41`, which `https.ts` delegates to) picks a compiler only from the `type` attribute and otherwise runs `compilers.autodetect` on the response body, ignoring the URL's extension, so data files are compiled as source code.

### 6. doc-mismatch: `Worker.prototype.terminate()` doesn't terminate the worker thread

- API: `Worker.terminate` (`src/layer3/worker.inc.d.ts:80-83`: "Terminate the worker thread. Equivalent to setting `onmessage` to `null`.")
- Repro: `cd worker && T=4 ../y.sh terminate-forever.js` (the worker runs a `setInterval`; main calls `w.terminate()` 200ms after the first message)
- Expected (per "Terminate the worker thread"): the worker stops and the process exits.
- Actual: `main: terminate()` is logged, then `worker still alive, tick 10`, `tick 20`, ... keep printing until the 4s timeout kills the process (exit 124). Only the second sentence of the doc is true. There is no API that actually stops a worker, so a stuck worker or `runInWorker` function can't be cancelled and keeps the process alive.

### 7. doc-mismatch: `StructuredClonable` lists types that `postMessage` refuses

- API: `Worker.postMessage`, `StructuredClonable` (`src/layer3/worker.inc.d.ts:86-112`), `runInWorker` doc (`runInWorker.inc.d.ts:28-33`)
- Repro: `cd worker && ../y.sh clonable.js`
- Expected: every type in the union, plus the runInWorker doc's "instances of native Error constructors", can be posted.
- Actual: `DataView`, `RegExp` and `Error` throw `TypeError: attempting to serialize unsupported object class: DATAVIEW` / `REGEXP` / `ERROR`. A Symbol gives the cryptic `InternalError: unsupported tag (-8)`. Works: `Boolean`/`String` wrappers, `SharedArrayBuffer`, `Date`, bigint, typed arrays, `undefined`, plain and nested objects. Class instances and `Path` arrive as plain objects with the prototype lost, which the doc doesn't mention.

### 8. gap: Node-style module interop is missing named imports from CommonJS, `exports`, extensionless `main`, `.cjs`, `.mts`/`.cts`

- API: module resolution (`src/layer1/module-hooks.ts`), cjs-interop, extension handlers
- Repro: `cd nm && ../y.sh main.js`; `./y.sh interop/named-import.js`
- Actual:
  - `import { a } from "../langs/lib-cjs.js"` (`module.exports = { a: 1, b: 2 };`) fails with `SyntaxError: Could not find export 'a' in module '.../lib-cjs.js'`, located at `<internal>/quickjs.c:31305` with no user file or line. The default import and `await import(...)` give `module.exports`, but no names are exported from it; Node finds them statically. `import * as ns` also lists the internal `__cjsExports` and `__isCjsModule` keys next to `default`. Cause: `wrapCommonJSCode` (`cjs-interop.ts`).
  - `require("pkg-exports")` and `require("pkg-exports/sub")` (a package with only an `exports` map): `Cannot find module`. `exports` is never read.
  - `require("pkg-main-noext")` (`"main": "lib/index"`): `Cannot find module`. `potentialFilesForPath` (`module-hooks.ts:25-49`) accepts `main` only if it names an existing file exactly.
  - `require("./file.cjs")` (`module.exports = ...`): `ReferenceError: 'module' is not defined`. There's no `.cjs` compiler, so the CJS wrapper is never applied.
  - `require("./file.mts")` and `require("./file.cts")`: `SyntaxError: missing initializer for const variable`. No `.mts`/`.cts` compilers.
  - `require("./data")` doesn't find `data.json` (`.json` isn't in `searchExtensions`).
  - `require.main` is `undefined`.
  - Works: `main` naming a full filename, `.mjs`, CJS packages requiring relative files, `__dirname`/`__filename`/`module.id` inside CJS, module instance caching.

### 9. gap: `node:process` has no named exports, and `process` lacks the Node members scripts use most

- API: node-compat (`src/layer1/api/node-compat/node-compat.ts`)
- Repro: `cd node && ../y.sh esm-process-named.js`, `../y.sh esm-process.js`, `../y.sh proc.js a b`; `./y.sh -e 'const r = {}; for (const m of ["fs", "path", "os", "child_process", "util", "events", "node:path", "buffer", "process", "node:process"]) { try { require(m); r[m] = "ok" } catch (e) { r[m] = e.message.split(" (")[0] } } JSON.stringify(r)'`
- Actual:
  - `import { argv, env } from "node:process"` fails with `SyntaxError: Could not find export 'argv' in module 'node:process'`; `(await import("process")).argv` is `undefined`; `import * as ns from "process"` has keys `__cjsExports`, `__isCjsModule`, `default`. Only the default import works (`node-compat.ts:66-72`).
  - `process.stdout`, `stderr`, `stdin`, `cwd()`, `chdir()`, `pid`, `nextTick`, `on`, `hrtime`, `uptime`, `memoryUsage`, `kill` are all missing: `process.stdout.write("x")` throws `TypeError: cannot read property 'write' of undefined`, `process.cwd()` throws `TypeError: not a function`.
  - `require("fs")`, `"path"`, `"os"`, `"child_process"`, `"util"`, `"events"`, `"buffer"` and `node:` variants throw a bare `Cannot find module`, with no hint toward yavascript's equivalents.
  - The doc does say "a subset", hence gap, but `process.stdout.write`, `process.cwd()` and named imports from `node:process` are the first Node-isms a ported script hits. Also, `process.exit` is declared as returning `void` rather than `never` (`node-compat.inc.d.ts:45`).

### 10. gap: no top-level `await` (or `import.meta`) in `-e` or the REPL

- API: CLI `-e`, REPL
- Repro: `./y.sh -e 'await Promise.resolve(5)'`; `DEADLINE=5000 node drive.js 'await Promise.resolve(5){cr}|Promise.resolve(6){cr}|{x04}'`; `./y.sh -e 'import.meta.url'`
- Actual: `SyntaxError: expecting ';'` in both `await` cases, and a promise result prints as `Promise {}` with no state or value, so an async result can't be seen at the prompt without `.then(console.log)`. `import.meta` gives `SyntaxError: import.meta only valid in module code`. Files do support top-level await (`errs/tla-throw.js`); `-e` and the REPL use `engine.evalScript` (`src/layer5b/targets/eval.ts:17-20`, `js-repl.ts:116-119`). Many yavascript APIs have async variants, so this is a notable gap for 1.0.

### 11. gap: there's no way to run a script from stdin

- API: CLI
- Repro: `./y.sh -`; `IN='console.log("from stdin", 1 + 1)\n' ./y.sh /dev/stdin`; `timeout 5 ../../../dist/yavascript /dev/stdin < stdin-script.js`; `cat stdin-script.js | CLICOLOR=0 HOME=$PWD/home timeout 5 ../../../dist/yavascript | cat -v`
- Expected: some documented way to do `curl ... | yavascript` or `yavascript - < script.js`, like `node -`, `bash -s`, `deno run -`.
- Actual: `-` gives `Error: No such file or directory (errno = 2, path = .../-)`. `/dev/stdin` from a pipe gives `Failed to load module: Illegal seek (errno = 29, filename = /dev/fd/0)`; from a file redirect it resolves to a nonexistent path (`filename = /dev/fd/stdin-script.js`). Piping into bare `yavascript` feeds the script through the REPL line by line: every character is echoed followed by `ESC[J`, and `> ` prompts and `undefined` results are mixed into the output.

### 12. gap: InteractivePrompt can't be stopped from code, doesn't report that it stopped, and doesn't wait for an async `handleInput`

- API: `InteractivePrompt` (`src/layer1/api/repl/interactive-prompt.ts:58-75`)
- Repro: `DELAY=600 DEADLINE=4000 node drive.js 'one{cr}|two{cr}|{x04}' ip/async-handler.js` (handler: `async (input) => { await sleep.async(200); console.log("finished handling:", input) }`); `IN='one\n' ./y.sh ip/async-handler.js`
- Actual: output is `async> one`, `async> finished handling: one`, `two`, `async> finished handling: two`. The next prompt is printed as soon as `handleInput` returns its promise, so the handler's output lands after the prompt and the user can type while it is still running. With piped input, the process exits at EOF before `finished handling: one` is ever printed.
- Also: `start()` throws away the engine handle that has `stop()` (`interactive-prompt.ts:66-74` discards what `startReplEngine` returns, `repl-engine.ts:923-929`), so instances have no `stop()`/`close()` (`typeof p.stop` is `undefined` in `ip/basic.js`), and there's no callback or promise for "the user pressed Ctrl+D". Double Ctrl+C and stdin reaching EOF always call `exit(0)` (`repl-engine.ts:138`), so a program can't clean up or pick its exit code (shells use 130). These are what a confirm prompt or a multi-step wizard needs.

### 13. rough-edge: REPL multi-line handling is JS-only, and directives are processed on continuation lines

- API: default REPL (`src/layer1/api/repl/js-repl.ts`)
- Repro (the second command types a backslash followed by `tsecond`):

```sh
DEADLINE=6000 node drive.js 'square = (x) ->{cr}|  x * x{cr}|square 4{cr}|{x04}' --lang coffee
DEADLINE=6000 node drive.js 'const s = `first{cr}|\tsecond`{cr}|JSON.stringify(s){cr}|{x04}'
```

- Actual:
  - CoffeeScript: `square = (x) ->` is evaluated at once as `square = function(x) {}`, then `  x * x` runs alone (`ReferenceError: 'x' is not defined`), and `square 4` returns `undefined`. Indentation-based blocks can't be entered in the Coffee or Civet REPLs, because completeness comes from the JS colorizer's bracket balance (`js-repl.ts:149-156`).
  - Inside an unterminated template literal, a continuation line starting with `\` is taken as a directive: `Unknown directive: tsecond`, the line is dropped, and the REPL stays inside the template. A continuation line that is exactly `?` prints help instead. `preprocessLine` (`js-repl.ts:158-171`) runs on every line, continuation lines included.

### 14. rough-edge: the REPL can't start if its config dir can't be created

- API: default REPL, `InteractivePrompt` with `historyFileName` (`src/layer1/api/repl/history-file.ts`)
- Repro: `YS_HOME=/dev/null DEADLINE=4000 node drive.js '1+1{cr}|{x04}'` and `YS_HOME=/dev/null DEADLINE=4000 node drive.js 'x{cr}|{x04}' ip/basic.js hist.txt`
- Expected: `interactive-prompt.inc.d.ts:97-100` says that when there's nowhere to write, history is kept for the session only.
- Actual: `Error: Cannot use mkdir to create directory '/dev/null/Library/Application Support/yavascript' because '/dev/null' is a file, not a directory.` and exit 1 before any prompt. Only an unset `HOME` falls back to session history; an unwritable one (read-only containers, `HOME=/`) makes the REPL unusable. The `HistoryFile` constructor (`history-file.ts:13-27`) doesn't catch `mkdir`/`touch` failures.

### 15. rough-edge: Worker globals differ from the main thread, contrary to the doc

- API: `Worker` (`src/layer3/worker.inc.d.ts:1-10`: "loads all of the YavaScript API globals into the Worker's global context")
- Repro: `cd worker && ../y.sh main2.js globals`, `../y.sh main2.js missing`, `../y.sh main2.js undefined-options`
- Actual:
  - Inside a worker, `typeof runInWorker` and `typeof Context` are `"undefined"`; `Worker` is the raw `quickjs:os` Worker (`Worker === require("quickjs:os").Worker` is `true`); `new Worker(...)` throws `TypeError: cannot create a worker inside a worker`; `scriptArgs` (and so `process.argv`) is `[]`. None of this is documented.
  - `__yavascript_layer1_internals` and `__yavascript_layer2_internals` stay on the worker's global (enumerable), though the main thread deletes them (crosscut report #17 covers the main-thread leaks). Cause: the worker bootstrap (`src/layer3/worker.ts:90-99`) only runs layers 1 and 2 and never cleans up.
  - `new Worker("./does-not-exist.js")` throws `Error: Failed to normalize module name`, without the path.
  - `new Worker(file, undefined)` throws `TypeError: invalid 'in' operand`, though `options` is optional in the type (`worker.ts:47-48` checks `args.length` and then uses `in` on `args[1]`).

### 16. doc-mismatch: InteractivePrompt `printInput` output must be exactly as wide as the input

- API: `InteractivePrompt` `printInput` (`interactive-prompt.inc.d.ts:70-80`: "so that you can colour it or mark it up")
- Repro: `RAW=1 DEADLINE=4000 node drive.js 'ab{cr}|{x04}' ip/printinput.js` (`printInput` writes `"<" + input.toUpperCase() + ">"`)
- Actual raw stdout: `[1]> <A>` `ESC[J` `ESC[D` `<AB>` `ESC[J`. After drawing `<A>` (3 columns), the engine moves left 1 column (the input's length) before redrawing, so a terminal shows `[1]> <A<AB>` with the cursor in the wrong place. Only zero-width markup (ANSI colors) works. Cause: `update()` (`repl-engine.ts:308-350`) computes cursor columns from `cmd`, not from what `printInput` wrote.

### 17. rough-edge: REPL Tab completion evaluates getters and prints their exceptions

- API: default REPL completion (`src/layer1/api/repl/js-completions.ts`)
- Repro: `DEADLINE=5000 node drive.js 'cp.{tab}|1+1{cr}|{x04}'`; `DEADLINE=6000 node drive.js 'globalThis.bad = { get boom() { throw new Error("getter threw") } }; 0{cr}|bad.boom.{tab}|2+2{cr}|{x04}'`
- Expected: nothing happens when there's no object to complete against. The comment on `evalForCompletion` (`js-completions.ts:27-32`) says unresolvable names must not escape and print a stack trace over the line.
- Actual: Tab prints `ReferenceError: 'cp' is not defined. Did you mean 'copy'?` (the stub global's getter) or `Error: getter threw`, each with 7 to 9 internal frames, over the line being edited. Cause: `getContextObject` reads `obj[base]` directly (`js-completions.ts:85-89`), outside the try/catch. `suffixForCandidate` (`js-completions.ts:181-190`) also runs getters on a double Tab.

### 18. rough-edge: `with { type }` names don't line up with `--lang`, and unknown types are silently ignored

- API: import attributes, extension handlers (`src/layer1/extension-handlers/`)
- Repro: `cd data && ../y.sh attr-types.js`; `./y.sh -e 'import("./data/data.txt", { with: { type: "bogus" } }).then(m => console.log(Object.keys(m)), e => console.log("rejected:", e.message))'`
- Actual:
  - `type: "typescript"` and `type: "coffeescript"` work, but `type: "ts"` and `type: "coffee"` (both valid `--lang` values) aren't registered (`extension-handlers/ts.ts:8`, `coffee.ts:9`).
  - An unregistered `type` (`"ts"`, `"coffee"`, `"bogus"`) is silently ignored and the file is parsed as JS, so the error is a misleading `SyntaxError` (`missing initializer for const variable`, `unexpected token in expression: '>'`) rather than "unsupported import type", and a file that happens to be valid JS loads as JS.
  - `import * as ns from "./data.json"` exposes the internal `__cjsExports` and `__isCjsModule` keys next to `default`.

### 19. doc-mismatch: yavascript's module resolution rules aren't documented anywhere

- API: module system
- Repro: `./y.sh order/main.js` (a directory with both `x.js` and `x.ts`; `import x from "./x"` prints `from ts`); `./y.sh -e 'require("quickjs:engine").ModuleDelegate.searchExtensions'` gives `[".civet", ".ts", ".tsx", ".coffee", ".jsx", ".js"]`
- The only resolution doc is QuickJS's `modulesys.md`, which says `searchExtensions` "Defaults to `[".js"]`" (`meta/website/docs/modulesys.md:34`) and that `.json` isn't loaded by extension alone (`:75-83`). In yavascript, extensionless imports prefer `.civet`/`.ts`/`.tsx`/`.coffee`/`.jsx` over `.js` (`src/layer1/extension-handlers/_load-all.ts:16-23`); `.json` loads by extension as JSON5; `.yaml`/`.yml`/`.toml` load by extension, except from a URL (finding 5); `node_modules` is searched using `main` but not `exports` (finding 8); CommonJS is detected heuristically from the source text; `require` unwraps CJS, while `import` gets `module.exports` as the default export and no named exports (finding 8). The README's "Languages" section (`README.md:116-124`) names the languages and nothing else.

### 20. rough-edge: missing-file and compile errors show raw errno text and internal stack frames

- API: CLI run-file target
- Repro: `./y.sh nonexistent.js`, `./y.sh --help extra`, `./y.sh langs` (a directory), `./y.sh -r nope.js -e 1`, `./y.sh langs/bad2.ts`
- Actual:
  - `Error: No such file or directory (errno = 2, path = /.../nonexistent.js)` followed by 11 frames such as `at <internal>/quickjs-os.c:1015:0` and `at runFileTarget (yavascript-internals/dist/bundles/layer5b-arm64.js:29160:26)`. A directory gives `Failed to load module: Input/output error (errno = 5, ...)`. `--help extra` tries to run a file named `--help`. All exit 1, while the `invalid` target uses 3. Cause: `realpath` in `src/layer5b/targets/run-file.ts:43` throws straight into `runMain`'s `printError`.
  - A TS compile error prints `SyntaxError: Error transforming .../bad2.ts: Unexpected token (2:17)`, then 46 internal frames (sucrase's parser, `call (native)`, `module-impl.js`) and `fileName: "yavascript-internals/dist/bundles/layer1.js"`, with no frame at the user's file. The plain-JS equivalent (`langs/bad2.js`) prints `at .../bad2.js:2:17`. Message formats per compiler are already covered by formats report #19.

### 21. rough-edge: `yavascript -v` / `--version` print no trailing newline

- API: CLI
- Repro: `./y.sh -v | od -c | head -2`
- Actual: `git-d8cc554c0810` is immediately followed by the next output (`[exit=0]`), so a shell prompt lands on the same line. `--help`, `--license` and `--print-types` all end in `\n`. Cause: `std.out.puts(version)` (`src/layer5b/targets/version.ts:8`).

### 22. question: `yavascript -- script.js` opens the REPL and ignores the file

- API: CLI (`src/layer5b/determine-target.ts:110-118`)
- Repro: `T=3 ./y.sh -- args.js x` prints `> ` and, with stdin at EOF, exits 0 without running `args.js`.
- Question: this is snapshotted as intended (`meta/tests/src/determine-target.test.ts:46-47`: `["--", "-v"]` is `repl`), but `node -- file.js` and similar CLIs run the first argument after `--`. Someone writing `yavascript -- "$script" "$@"` defensively gets a REPL, and in CI a silent exit 0 with the script never run. Related (exec report F1): `--lang` is also consumed after a script filename, so user scripts can't accept a `--lang` flag (`./y.sh args.js --lang potato` exits 3 with `Invalid --lang`).

### 23. question: an unsettled top-level `await` exits 0 silently

- API: module evaluation
- Repro: `cd errs && ../y.sh tla-never.js` (`console.log("before"); await new Promise(() => {}); console.log("after");`)
- Actual: prints `before` and exits 0; `after` never runs. Node exits with code 13 and prints "Warning: Detected unsettled top-level await". A script can skip the rest of its work and still report success.

### Already-reported issues seen again (not re-investigated)

- `--lang ts -e` with statements fails because of `expression: true` (formats #18). The same happens for `--lang civet -e 'x := 3'` (`SyntaxError: Unexpected token (1:2)`).
- `runInWorker` doc example without `await` prints `Promise {}` (`worker/doc-example.js`).
- `process.version` is `v16.19.0`; no `fetch`/`URL`/`Buffer`/`queueMicrotask`/`setImmediate`/`atob` (`node/proc.js`).
- `startRepl` context goes onto `globalThis` (`ip/startrepl.js`: `typeof myVar` is `"number"` at the prompt).

## Verified working

- CLI flags: `-v`, `--version`, `-version`, `-h`/`--help` (no ANSI when piped), `--license`, `--print-types` all exit 0. Missing arguments (`-e`, `--lang`, `-r`) and `--lang potato` print a message plus a `--help` hint and exit 3. `--lang js file a b` forwards `a b`; `-r file -e code` and `-r throw.ts -e ...` preload first; `--lang coffee file.txt` and `--lang ts file.js` compile with the chosen language.
- `-e`: expressions and statement lists (`const x = 1; x + 1` gives `2`), `null`, strings, objects, `function f() {}` (prints nothing), multi-line `--lang coffee`, `--lang jsx`/`tsx` expressions, `__filename` (`<cwd>/<evalScript>`), import lines followed or preceded by other lines, default imports of JSON/YAML/TOML/CJS, sync throw and `Promise.reject` exit 1.
- Exit codes: sync throw 1, unhandled rejection 1 (including from an async function), `process.exitCode = 7` gives 7, syntax error 1, `throw "a string"` prints `Non-error value was thrown` and exits 1, `Error` `cause` is printed, top-level await works and a throw after it exits 1, a rejection handled after an `await` doesn't count as unhandled.
- Languages: `langs/main.ts` imports JS, TS (enum, `import type`), JSX, TSX, CoffeeScript and Civet; `main.coffee` and `main-civet.civet` import across languages; TS imports YAML/TOML; shebang lines in `.js` and `.civet` main scripts; UTF-8 BOM in `.js`/`.ts`; CRLF line endings.
- Stack traces point at the user's source lines for TS (`throw.ts:10:18`), TSX (`throw.tsx:5:18`), JSX (`throw.jsx:7:18`), CoffeeScript (`throw.coffee:4:9`, and across files in `imports-throw.ts`), and Civet (`throw2.civet:2:18`).
- `import.meta`: `url` (`file://...`), `main` (true in the entry, false in imports), `require`, `resolve`, `attributes` (`undefined` without `with`); `__filename`/`__dirname` in TS.
- Import attributes: static `with { type: "json" }` on a `.txt` file (same module shape as a plain `.json` import, JSON5 syntax accepted), dynamic `import(..., { with })`, `require(..., { with })`, `require.resolve(..., { with })`; `.json`/`.json5`/`.yaml`/`.toml` by extension (import and require).
- `require`: relative CJS, instance caching, `__dirname`/`__filename`/`module.id` in CJS, `require("process")`/`require("node:process") === process`; `.mjs` files and packages whose `main` is a full filename. Module-not-found errors keep `err.name` as `Error`.
- ESM `import` of CommonJS: the default import and `await import(...)` of a CJS file or package give `module.exports`.
- URL modules: self-contained `https://` and `http://` modules (`ms@2.1.3/+esm`); an `http://` module's relative and root-relative imports resolve against its URL, and `with { type: "json" }` on a URL works.
- `Worker`: messages in both directions, `initialData`, `onerror` for a throw and for a rejection in the worker (with `message`, `filename`, `lineno`, `error`), `exit()` in a worker gives a clear error, static and dynamic imports of TS/Coffee/Civet and extensionless paths inside a worker, a worker file with a shebang or top-level `await`, `overrideCode` with an absolute nonexistent filename (`import.meta.url` matches), wrong argument count throws a clear error.
- `runInWorker`: sync and async return values, `require` inside the function resolves relative to the caller's file, yavascript globals inside, `throw "string"` from an async function rejects. A function that throws synchronously, rejects with an Error, or returns something that can't be cloned makes the call reject, and an unhandled rejection of it exits 1.
- `Context`: `eval`, separate `globalThis`, yavascript globals by default, `yavascriptGlobals: false`, nested `Context`, `console.log` inside, syntax and runtime errors thrown to the caller, absolute `require` (JS and TS), dynamic `import()`, timers inside a context fire; `date: false`, `promise: false` and `moduleGlobals: false` with the default yavascript globals are rejected with a clear message; with `yavascriptGlobals: false`, the `date`, `mapSet`, `timers`, `inspect`, `print`, `regExp`, `proxy`, `typedArrays`, `json` and `stringNormalize` options each remove what they say; no `scriptArgs` inside, as documented.
- REPL: single-line JS imports, imports in the TS/TSX REPL, ESM default imports, `startRepl` with context and `NOTHING`, `startRepl` with an invalid lang throws a clear error, Civet `x := 3`, `\h`, `\t`, `\load` of a valid JS file, TS `<Type>value`. The REPL exits 0 when stdin reaches EOF.
- `InteractivePrompt`: lines, custom prompt, Tab completion and double-Tab listing, `historyFileName` written and recalled with Up in a later session, Ctrl+D and double Ctrl+C exit, a throwing `handleInput`, `printInput` or `getCompletions` prints its error and the rest of the input is still processed, a malformed `getCompletions` result gets a clear `TypeError`, and stdin reaching EOF exits 0.
- Node compat: `global === globalThis`; `process.version`, `versions`, `arch`, `platform`, `env` (same object as `env`; writes reach child processes; numbers become strings), `argv`, `argv0`, `execPath`, `exitCode`; default import of `process` and `node:process`.

## Test coverage notes

- `meta/tests/src/eval.test.ts` covers an import line followed or preceded by other lines, but nothing covers an import followed by code on the same line, by trailing whitespace, or by a line starting with `[` or `(` (finding 1).
- No tests for directives inside continuation lines or multi-line Coffee/Civet (finding 13), unwritable config dirs (finding 14), or async `handleInput` (finding 12). The one `\load` test only checks that the REPL keeps going after a throwing script; nothing covers how its error is printed or `\load` of a `.ts` file (finding 3). The `printInput` test in `interactive-prompt.test.ts` draws output wider than the input, but its snapshot goes through the ANSI sanitizer, which removes the cursor moves finding 16 is about.
- `meta/tests/src/worker.test.ts` has no test for `terminate()` on a busy worker (finding 6), non-clonable payloads (finding 7), nested workers, or `runInWorker`/`Context` inside workers (finding 15).
- `meta/tests/src/context.test.ts` covers `date: false` and `promise: false` with the default yavascript globals, but not `moduleGlobals: false`, `modules: { "quickjs:bytecode": false }`, `console: false`, or unknown and non-object options (finding 2).
- No test asserts the exit code for an unsettled top-level await (finding 23).
- `meta/tests/src/cjs-interop.test.ts` covers the default import and `await import(...)` of a CommonJS file, but no named import (finding 8). Its "a JSON file required through an import attribute" test passes `{ type: "json" }` rather than `{ with: { type: "json" } }` on a `.json` file, so it would pass whether or not attributes are honored.
- No fixture has a `node_modules` directory or a `package.json`, so package resolution (`main`, `exports`, index files) is untested (finding 8). No `.cjs`/`.mts`/`.cts` fixtures.
- `meta/tests/src/import-attributes.test.ts` covers static `import ... with { type }` on extensionless fixtures and `require(..., { with })`. A local dynamic `import(..., { with })`, `type: "json"` on a file using JSON5 syntax, and the `type` names and unknown values in finding 18 are untested.
- `meta/tests/src/http-modules.test.ts` covers `http:` URL modules only, and never imports a `.json` or `.yaml` URL without an attribute (finding 5); the `https:` and `npm:` protocols have no tests.
- No test for `node:process` named imports or for `process` members beyond the snapshot of globals (finding 9).
- No CLI test for running a script from stdin (`yavascript -`, `/dev/stdin`; finding 11), a missing script file (finding 20), or the `-v` output bytes (finding 21).
