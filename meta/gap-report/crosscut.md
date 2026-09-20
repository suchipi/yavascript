# YavaScript 1.0 cross-cutting audit

Binary: `dist/yavascript` (`yavascript.version` = `git-3eedd831a85c`, arm64, macOS). All commands run from the repo root. Scratch scripts and raw logs are in `.tmp/api-audit/crosscut-sandbox/`.

Method notes:

- Globals were enumerated with `.tmp/api-audit/crosscut-sandbox/enum-globals.js` (output: `enum-globals.out.json`).
- Object shapes were compared with TypeScript itself: `gen-shape-check.js` dumps runtime property names for 46 documented objects/modules/classes into `shape-check.ts`, and `node_modules/.bin/tsc -p .tmp/api-audit/crosscut-sandbox/tsconfig.json` reports every runtime key the d.ts doesn't declare and every declared key missing at runtime (log: `tsc-shape.log`).
- QuickJS module spot checks: `qjs-check.js` (log: `qjs-check.log`) and `os-async.js`.
- Built-ins matrix: `builtins.js` (log: `builtins.log`).
- Doc scans: `doc-scan.js` (undocumented declarations), `link-check.js` (generated-doc-links.json5 anchors and coverage).

## Findings

### 1. bug - `Array.prototype.grep` / `String.prototype.grep` are enumerable, so they show up in `for...in`

- Repro: `./dist/yavascript .tmp/api-audit/crosscut-sandbox/proto-ext.js`
- Expected: `for (k in [1, 2])` yields `"0"`, `"1"` (built-in methods are non-enumerable).
- Actual: `forInArray: ["0", "1", "grep"]`, `forInString: ["0", "1", "grep"]`. Descriptors: `Array.prototype.grep` enumerable `true`, `String.prototype.grep` `true`, `String.dedent` `true`, `Promise.map` `true` (`RegExp.escape` is `false` only because it overwrote a pre-existing native property, see finding 2).
- Impact: any user code or npm dependency that iterates arrays with `for...in` gets a stray `"grep"` key.
- Cause: plain assignment in `src/layer1/api/grep/grep.ts:85` and `:94`, `src/layer1/api/string-dedent/string-dedent.ts:5`, `src/layer1/api/promise-map/promise-map.ts:16`. Should use `Object.defineProperty(..., { enumerable: false, writable: true, configurable: true })`.

### 2. bug - yavascript replaces QuickJS's native, spec-compliant `RegExp.escape` with an older, less safe polyfill

- Repro: `./dist/yavascript -e 'const c = new Context({ yavascriptGlobals: false }); [c.eval("RegExp.escape(\"a-c\")"), RegExp.escape("a-c"), new RegExp("[" + RegExp.escape("a-c") + "]").test("b"), RegExp.escape(123)]'`
- Expected (ES2025 `RegExp.escape`, which the engine already ships natively): `"\\x61\\x2dc"`, escaping is safe inside a character class, and non-strings throw `TypeError`.
- Actual: native engine gives `"\\x61\\x2dc"`, but the yavascript global gives `"a-c"`; `new RegExp("[" + RegExp.escape("a-c") + "]").test("b")` is `true` (the escaped text became a range); `RegExp.escape(123)` returns `"123"` instead of throwing.
- Cause: `src/layer1/api/regexp-escape/regexp-escape.ts:2-9` unconditionally assigns a regex-replace polyfill. The d.ts text at `yavascript.d.ts:4524-4525` (from `src/layer1/api/regexp-escape/regexp-escape.inc.d.ts:7`) still calls it "the stage 2 ECMAScript proposal"; it is now standard. Suggest dropping the install when `RegExp.escape` already exists.

### 3. doc-mismatch - 12 `BigInt.*` methods are declared but don't exist at runtime

- Repro: `./dist/yavascript -e 'BigInt.tdiv(7n, 2n)'`
- Expected (per `yavascript.d.ts:5122-5211`): `3n`.
- Actual: `TypeError: not a function`. `typeof BigInt.X` is `undefined` for all of `tdiv fdiv cdiv ediv tdivrem fdivrem cdivrem edivrem sqrt sqrtrem floorLog2 ctz` (`qjs-check.log` lines 4-20). TypeScript accepts `BigInt.tdiv(7n, 2n)` with no error (`.tmp/api-audit/crosscut-sandbox/user-script.ts`, `tsc-plain.log`), so users get a runtime crash on well-typed code.
- Source: upstream `node_modules/@suchipi/quickjs/build/dts/quickjs.d.ts:40` onward. Generated docs also still describe them (`meta/generated-docs/quickjs-extensions.md` "BigIntConstructor" sections).

### 4. bug - `remove()` throws on a missing path even though it's documented as `rm -rf`

- Repro: `./dist/yavascript -e 'remove(".tmp/api-audit/crosscut-sandbox/does-not-exist")'` versus `rm -rf .tmp/api-audit/crosscut-sandbox/does-not-exist`
- Expected (`yavascript.d.ts:419-425`: "Provides the same functionality as the command `rm -rf`"): no error, like `rm -rf` (exit 0).
- Actual: `Error: No such file or directory (errno = 2)` and exit 1. The error also doesn't say which path (see finding 24). Probably overlaps with the filesystem audit.

### 5. bug - `new Worker(relativeName, { overrideCode })` fails when the file doesn't exist on disk

- Repro: `./dist/yavascript .tmp/api-audit/crosscut-sandbox/worker-relative.js`
- Expected (`yavascript.d.ts:4746-4750`: "`moduleFilename` is not read from disk and is only used as the module's assigned filename"): both work.
- Actual: `./qjs-sandbox/mod.js -> ok` (the file exists) but `./does-not-exist.js -> Failed to normalize module name`. Absolute paths work.
- Cause: `src/layer3/worker.ts:31-37` resolves relative names through `engine.resolveModule`, which requires the file to exist.

### 6. doc-mismatch - `std.sprintf` is typed as returning `void`

- Repro: `./dist/yavascript -e 'std.sprintf("%x", 255)'`
- Expected per d.ts (`yavascript.d.ts:5573`): `void`. Actual: `"ff"`. `const s: string = std.sprintf(...)` fails typecheck: `Type 'void' is not assignable to type 'string'` (`tsc-plain.log`).
- Source: upstream `node_modules/@suchipi/quickjs/build/dts/quickjs-std.d.ts:174`.

### 7. doc-mismatch - `quickjs:cmdline` doc example imports a nonexistent `scriptArgs` export

- Repro: `./dist/yavascript .tmp/api-audit/crosscut-sandbox/cmdline-example.js` (contains the doc's `import { scriptArgs, exit } from "quickjs:cmdline";`)
- Expected: runs. Actual: `SyntaxError: Could not find export 'scriptArgs' in module 'quickjs:cmdline'`. The module's exports are exactly `getScriptArgs`, `exit`, `getExitCode`, `setExitCode` (shape check).
- Source: `yavascript.d.ts:6321`, upstream `quickjs-cmdline.d.ts:8`; also in `meta/generated-docs/cmdline.md:17`.

### 8. doc-mismatch - `ModuleDelegate` examples use a global that doesn't exist and a stale module name

- Repro: `./dist/yavascript -e 'typeof ModuleDelegate'` gives `undefined`; `./dist/yavascript .tmp/api-audit/crosscut-sandbox/std-example.js` (doc's `import * as std from "std";`) gives `Couldn't resolve module 'std'`.
- Expected: the examples at `yavascript.d.ts:6417` (`ModuleDelegate.compilers[".json"] = ...`) and `:6429-6433` work as written. The d.ts only declares `interface ModuleDelegate`; the object is reachable only as `import { ModuleDelegate } from "quickjs:engine"`. The `"std"` import is unused in the example anyway.
- Source: upstream `quickjs-modulesys.d.ts:54`, `:66-68`.

### 9. doc-mismatch - `process.exitCode` / `process.exit` docs name `std` functions that don't exist

- Repro: `./dist/yavascript -e 'typeof std.getExitCode + " " + typeof std.setExitCode + " " + typeof std.exit'` gives `undefined undefined undefined`.
- Docs (`yavascript.d.ts:6721-6729`, from `src/layer1/api/node-compat/node-compat.inc.d.ts:38` and `:43`) say they use `std.getExitCode()`, `std.setExitCode()`, `std.exit()`. The implementation uses `quickjs:cmdline` (`src/layer1/api/node-compat/node-compat.ts:41-54`).

### 10. doc-mismatch - `runInWorker` example is missing `await`, and the type rejects the sync functions the doc allows

- The example (`yavascript.d.ts:4864-4867`, `src/layer3/runInWorker.inc.d.ts:20`) does `const uppercased = runInWorker(...)` then `console.log(uppercased); // "BOB"`, but the function returns a Promise.
- `@param workerFunction` says "Sync or async function", but the signature is `(inputs: Inputs) => Promise<Output>` (`yavascript.d.ts:4887`). `await runInWorker({ s: "a" }, ({ s }) => s.toUpperCase())` fails typecheck: `Type 'string' is not assignable to type 'Promise<string>'` (`tsc-plain.log` line 2).

### 11. doc-mismatch - `types` namespace: doc list, declared type, and runtime disagree

- Repro: `node_modules/.bin/tsc -p .tmp/api-audit/crosscut-sandbox/tsconfig.json` (see `tsc-shape.log` lines 2-6), and `./dist/yavascript -e '[types.optional(Number)(undefined), types.objectOrNull(null), types.anyTypeValidator(types.string), typeof types.objectStr]'` gives `[true, true, true, "function"]`.
- On `types` at runtime and in the doc-comment list, but missing from the declared type: `objectOrNull`, `anyTypeValidator`, `unknownTypeValidator`, `optional`.
- In the declared type (`types.tuple`, `yavascript.d.ts:3240`) but missing from the doc list of constructors (`yavascript.d.ts:2177-2203`).
- Runtime-only and undocumented: `types.objectStr` (a pheno internal), which throws `TypeError: not an object` on `types.objectStr(null)`.

### 12. doc-mismatch - runtime APIs missing from the d.ts

From `tsc-shape.log` and `enum-globals.out.json`:

| Runtime API | Evidence |
| --- | --- |
| `yavascript.compilers.esmToCjs` | `./dist/yavascript -e 'yavascript'` lists `esmToCjs`; defined `src/layer1/compilers.ts:300` |
| `process.platform` | `./dist/yavascript -e 'process.platform'` gives `"darwin"`; set at `src/layer1/api/node-compat/node-compat.ts:56`; TS error `Property 'platform' does not exist` |
| `Path.from(segments, separator?)` | inherited from nice-path and rebound at `src/layer1/api/path/path.ts:184`; `Path.from("/a/b")` throws `TypeError: not a function` because it wants an array |
| `performance` global (`{ now }` only) | `./dist/yavascript -e 'Object.getOwnPropertyNames(performance)'` gives `["now"]` |

`TextEncoder`/`TextDecoder` exist only as `quickjs:encoding` exports, which matches the d.ts.

### 13. doc-mismatch - `ChildProcessOptions.logging.trace` doc contradicts `logger` doc

- `yavascript.d.ts:1647-1648` (`src/layer1/api/exec/ChildProcess.inc.d.ts:110-111`): "`logger.trace` defaults to a function which writes to stderr."
- `yavascript.d.ts:4166` and runtime: `./dist/yavascript -e 'String(logger.trace)'` gives `function noop()`.

### 14. doc-mismatch - embedded compiler versions in docs are stale

- `yavascript.compilers` docs (`src/layer1/api/yavascript/yavascript.inc.d.ts:59,69,79,102`) say Sucrase 3.35.0 and Civet 0.9.0.
- `node_modules/sucrase/package.json` is `3.35.1`, `node_modules/@danielx/civet/package.json` is `0.11.14` (`package.json` pins `^3.35.1` / `^0.11.14`). CoffeeScript 2.7.0 is correct.

### 15. doc-mismatch - smaller doc errors

| Where | Problem |
| --- | --- |
| `yavascript.d.ts:4361` (`src/layer1/api/jsx/jsx.inc.d.ts:174`) | Fragment example declares `const frag` but logs `a.type === JSX.Fragment` |
| `yavascript.d.ts:3655-3658` (`src/layer1/api/is/is.inc.d.ts:44`) | stale snippet "Defined in yavascript/src/api/is" with an old `is(value, type): boolean` signature |
| `yavascript.d.ts:1395` (`src/layer1/api/exec/exec.inc.d.ts:55`) | says `captureOutput` "utf-8", but the accepted value is `"utf8"` (`yavascript.d.ts:1463`) |
| `yavascript.d.ts:6274-6300` | `os.WAIT_OBJECT_0/ABANDONED/TIMEOUT/FAILED` say "only present on windows" but exist on macOS: `[0, 128, 258, -1]` (`qjs-check.log` line 83) |
| `yavascript.d.ts:4893-4898`, `:6993` | "within code can be executed" (missing "which") |
| `meta/generated-docs/README.md:21` | describes `remove` as "Delete (unlink) a file"; it is recursive |

### 16. gap - generated Markdown drops doc comments on inline option-object properties

- Repro: `grep -n "Enables \`Date\`" meta/generated-docs/*.md` (no output); `grep -n "Strip diagnostic" meta/generated-docs/bytecode.md` (no output); `grep -n "How many jobs" meta/generated-docs/promise-map.md` (no output).
- Expected: the per-option docs in the d.ts (`Context` options `date`/`eval`/.../`yavascriptGlobals` at `yavascript.d.ts:4943-5062`; `bytecode.fromFile` `strip` at `:6905-6921`; `fromValue` `preserveReferences`/`serializeErrors` at `:6944-6960`; `Promise.map` `concurrency` at `:4602-4610`) appear in the website/Markdown docs.
- Actual: `meta/generated-docs/context.md:93-120` shows only the bare type for the constructor options. So the web docs never explain what `yavascriptGlobals` does or that `eval: false` doesn't disable `Context.eval`. The cause is presumably dtsmd not rendering nested property docs (I didn't dig into dtsmd).

### 17. gap - the `inspect.custom` protocol is undocumented and differs from Node

- Repro: `./dist/yavascript -e 'class A { [inspect.custom](inputs) { inputs.type = "Renamed"; inputs.propLines.push("hello: 1"); } }; class B { [inspect.custom]() { return "RET"; } }; [inspect(new A()), inspect(new B()), inspect({ [inspect.custom](i) { i.type = "OwnProp"; } })]'`
- Actual: `"Renamed {\n\thello: 1\n}"`, `"B {}"`, and the third prints the symbol-keyed function as a regular property. So the hook has to mutate `InspectCustomInputs`, its return value is ignored (Node uses the return value), and an own-property hook on a plain object is ignored.
- Docs: `InspectFunction.custom` says only "A symbol which can be used to customize how an object gets printed" (`yavascript.d.ts:5327-5330`), and `InspectCustomInputs` (`:5343-5356`) and `InspectColours` have no doc comments at all.

### 18. rough-edge - generated-doc-links.json5 has broken/stale entries and coverage holes

- Repro: `./dist/yavascript .tmp/api-audit/crosscut-sandbox/link-check.js` (log: `link-check.log`).
- Broken anchors in `meta/scripts/lib/generated-doc-links.json5`: `setExitCode` points to `#quickjsstdsetexitcode-exported-function`, but the heading is `quickjs:cmdline` (line 150). The five `BigFloatEnv.*` entries (lines 165-168, 174) point at sections that no longer exist. `'"quickjs:modulesys"'` (line 206) points to `#quickjsmodulesys-namespace`, which isn't in `modulesys.md` (and no such module exists).
- Documented globals with no link entry: `yavascript`, `_is`, `global`, `process`, `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`. `{@link Context.eval}` (`yavascript.d.ts:4949`) has no entry.
- The docs index (`meta/generated-docs/README.md`, from `meta/scripts/lib/generated-doc-index.md`) has no list items for `readEnvBool`, `Array.prototype.grep`, the `yavascript` object, `process`/`global`, or the global timer functions.

### 19. rough-edge - repo `yavascript.d.ts` is not prettier-formatted, so it differs from `--print-types` and `meta/npm/yavascript.d.ts` beyond the header

- Repro: `./dist/yavascript --print-types > .tmp/api-audit/crosscut-sandbox/print-types.d.ts; diff .tmp/api-audit/crosscut-sandbox/print-types.d.ts yavascript.d.ts`
- Expected: only the 5-line "reflects what is in git" header differs. Actual: about 40 extra hunks of formatting (trailing commas, union line breaks, blank lines). `meta/npm/yavascript.d.ts` is byte-identical to `--print-types`, and `yavascript.getTypesDts() === <print-types output>` is `true`. The content is semantically the same.
- Cause: `meta/ninja/dts.ninja.ts:48-52` runs prettier on `dist/dts/yavascript-git-raw.d.ts` without the `PRETTIER_FLAGS: "--ignore-path ''"` that the build at lines 30-37 uses. Prettier 3.9.5 honours `.gitignore` by default, and `.gitignore:3` ignores `dist`, so the file passes through unformatted. `diff dist/dts/yavascript-git-raw.d.ts yavascript.d.ts` shows no differences.

### 20. rough-edge - internal globals leak into user scope

- `__kame_instances__` (enumerable, so it shows in `Object.keys(globalThis)`) and `__qjsbootstrap_offset` (non-enumerable, value `2177742`) are visible to scripts: `./dist/yavascript -e '[typeof __kame_instances__, __qjsbootstrap_offset]'`. The layer loader deletes `__bytecode_layerN` / `__yavascript_layerN_internals` but not these.
- Instance internals appear on public objects: `ChildProcess` instances have `_logging`, `_state`, `_getPidRaw`, `_updateState`, `_waitpid`, and `Path` instances have `__is_Path` (`tsc-shape.log` lines 9-14). These are probably fine, but they aren't documented as private.

### 21. rough-edge - "did you mean" stub globals break `typeof` feature detection

- Repro: `./dist/yavascript -e 'typeof cp'`
- Expected (standard JS for an undefined name): `"undefined"`. Actual: throws `ReferenceError: 'cp' is not defined. Did you mean 'copy'?`. `"FILE" in globalThis` is `true`, and `typeof FILE` also throws.
- Affects `ensureDir cp mv ren rm grep man cwd where id openURL FILE` (`src/layer1/api/commands/_stubs.ts`, `src/layer1/api/_install-api.ts:29-38`). `id` and `where` are common identifiers in library feature checks. Also question for 1.0: should the `ensureDir` "has been renamed" stub be kept?

### 22. rough-edge - the d.ts conflicts with TypeScript's DOM lib, and the README doesn't mention it

- Repro: `node_modules/.bin/tsc -p .tmp/api-audit/crosscut-sandbox/tsconfig.dom.json` (log: `tsc-dom.log`).
- Actual: `Duplicate identifier` errors for `Worker`, `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`, `resolve` (`yavascript.d.ts:4742, 5389-5398, 6584`). With `lib: ["esnext"]` the d.ts itself is error-free (`tsc-plain.log` only has errors in the test script).
- `README.md:126-138` recommends `/// <reference path="./yavascript.d.ts" />` without saying to leave out the DOM lib (VS Code's default JS project includes it).

### 23. rough-edge - many public declarations have no doc comment

From `doc-scan.js` (`doc-scan.log`):

- Top level: `assert` (the object itself, `yavascript.d.ts:3675`), the `std` and `os` globals (`:7259-7260`), `number`/`string`/`boolean`/`bigint`/`symbol` (only a `//` comment), `InspectColours`, `InspectCustomInputs`, `GrepOptions`, `WhichOptions`, `BaseExecOptions`, `ChildProcessState`.
- `quickjs:os`: about 90 exports with no doc, including `read`, `write`, `isatty`, `ttyGetWinSize`, `ttySetRaw`, `remove`, `rename`, `realpath`, `getcwd`, `chdir`, `mkdir`, `readdir`, `stat`, `lstat`, `utimes`, `symlink`, `readlink`, `signal`, `kill`, `exec` / `ExecOptions`, `waitpid`, `dup`, `dup2`, `pipe`, `sleep`, `access`, `execPath`, `chmod`, `gethostname`, `platform`, `Worker`, plus all `O_*` / `S_*` / `SIG*` / `W*` constants after the first.
- `quickjs:encoding`: `toUtf8`, `fromUtf8`.
- Members: every `types.*` validator has no per-member doc; `ChildProcess.state` / `pid`; `WhoAmIResult` fields; `GrepMatchDetail.lineNumber` / `lineContent` / `matches`.

### 24. rough-edge - filesystem error messages are inconsistent about naming the path

- Repro: `cd .tmp/api-audit/crosscut-sandbox && ../../../dist/yavascript error-messages.js`
- Include the path: `readFile`, `cat`, `cd`, `realpath`, `copy`, `std.open`, `os.stat`. Omit it (message is just `No such file or directory (errno = 2)`): `remove`, `readlink`, `isExecutable`, `chmod` (`rename` has it only in a property). `ls` on a missing path says `Not a directory: ./definitely-missing-path-xyz`, which is misleading.

### 25. rough-edge - U+2014 (em dash) characters in the published d.ts

- `rg -n "\x{2014}|\x{2013}" yavascript.d.ts` finds 15 lines (5918, 5927, 6090-6095, 6114, 6389, 6391, 6840, 6848, 6908, 6915, 6928, 6968). All come from the upstream QuickJS d.ts files (`quickjs-os.d.ts`, `quickjs-modulesys.d.ts`, `quickjs-engine.d.ts`, `quickjs-bytecode.d.ts`). Noted only because the project's style bans them.

### 26. question - `yavascript.ecmaVersion` is `"ES2023"`, which doesn't match what the engine supports

- `./dist/yavascript -e 'yavascript.ecmaVersion'` gives `"ES2023"` (`src/layer1/api/yavascript/yavascript.ts:7`). The engine lacks ES2021's `WeakRef`/`FinalizationRegistry` (also missing in a bare `Context`), but has many ES2025/ES2026 features: iterator helpers, Set methods, `Promise.try`, native `RegExp.escape`, regex modifiers, `Float16Array`, `Math.sumPrecise`, `Uint8Array` base64, `Error.isError`. The string is neither a floor nor a ceiling. Maybe document what it means, or drop it.

### 27. question - `process.version` claims `v16.19.0`

- `src/layer1/api/node-compat/node-compat.ts:15` has the comment "This version supports approximately the same syntax features as we do". Node 16 is well behind the engine's syntax support now, and libraries that gate on `process.versions.node` may take old code paths. Worth revisiting for 1.0.

### 28. question - `setTimeout` doesn't pass extra arguments to the callback

- Repro: `./dist/yavascript -e 'setTimeout((...a) => console.log(a), 1, "x", "y")'` prints `[]` (also `qjs-check.log` line 127). Web and Node pass `["x", "y"]`. The d.ts signature `setTimeout(func, delay)` is consistent with this, but porting scripts will silently lose the arguments.

### 29. question - naming consistency across the public API

- Acronym casing is mixed within yavascript's own API: `openUrl`, `startRepl`, `getTypesDts`, `readEnvBool` versus `GitRepo.prototype.commitSHA`. QuickJS adds `isFILE`, `parseExtJSON`, `urlGet`, `toUtf8`.
- There are two async sleeps with different naming: `sleep.async(ms)` and `quickjs:timers`'s `sleepAsync(ms)`.
- "Non-blocking" is spelled three ways: `exec(..., { block: false })` returns an object with a blocking `wait()` rather than a Promise, `sleep.async` returns a Promise, and `runInWorker` returns a Promise.
- `exec`'s `captureOutput: "utf8"` versus the encoding module's `"utf-8"` labels (see finding 15).

### 30. question - leftover TODO/HACK markers in src/

| Marker | Location | Note |
| --- | --- | --- |
| `// HACK: ... skypack` | `src/layer1/module-protocols/npm.ts:5` | `npm:` imports are rewritten to `https://cdn.skypack.dev`. `import leftPad from "npm:left-pad"` works today (`npm-proto.js`), but 1.0 depends on that third-party CDN. The `JSX` docs' React example uses `npm:react`. |
| `// TODO create actual QuickJS context` | `src/layer1/api/repl/start-repl.ts:19` | `startRepl(context)` does `Object.assign(globalThis, context)`, so the "context" leaks permanently into the real global scope |
| `// TODO: process.on("exit", ...)` | `src/layer1/api/node-compat/node-compat.ts:48` | |
| `// not yet implemented` sticky/setgid/setuid | `src/layer1/api/commands/chmod/chmod.ts:25-29` | the object form of `chmod` can't set these bits |
| `// TODO: birth time` | `src/layer1/api/filesystem/copy.ts:92` | |
| `// TODO: query cpu count, max memory...` | `src/layer1/api/_install-api.ts:5` | |
| `/* XXX: handle double-width characters */` | `src/layer1/api/repl/repl-engine.ts:244` | |

No "experimental", "unstable" or "deprecated" markers were found in `src/` or `yavascript.d.ts`.

## Built-ins matrix

From `./dist/yavascript .tmp/api-audit/crosscut-sandbox/builtins.js` (`builtins.log`), plus `esm-features.js`.

| Feature | Present | Notes |
| --- | --- | --- |
| `structuredClone` | no | ReferenceError (the d.ts has a `StructuredClonable` type, and Workers structured-clone internally) |
| `fetch` | no | `std.urlGet` (libcurl, sync) exists instead |
| `URL` / `URLSearchParams` | no | ReferenceError |
| `TextEncoder` / `TextDecoder` (global) | no | available from `quickjs:encoding` (works, including shift_jis) |
| `atob` / `btoa` | no | `Uint8Array.prototype.toBase64` / `Uint8Array.fromBase64` work |
| `crypto.randomUUID` / `crypto.getRandomValues` | no | no `crypto` global at all |
| `queueMicrotask` | no | |
| `setImmediate` | no | |
| `AbortController` / `EventTarget` / `Blob` | no | |
| `performance.now` | yes | only `now` (undeclared, finding 12) |
| `Intl` | no | `toLocaleString`/`toLocaleDateString` exist but ignore the locale and options: `(1234567.891).toLocaleString("de-DE")` gives `1234567.891`; `new Date(0).toLocaleDateString("en-US", { timeZone: "UTC" })` gives `12/31/1969` (local TZ); `(1234.5).toLocaleString("en-US", { style: "currency", currency: "USD" })` gives `1234.5`; `localeCompare` sorts `C,a,b` |
| `String.prototype.normalize` | yes | |
| `Array.prototype.findLast` / `findLastIndex` / `at` / `flat` | yes | |
| `toSorted` / `toReversed` / `with` | yes | |
| `Object.hasOwn` | yes | |
| `Object.groupBy` / `Map.groupBy` | yes | |
| `Array.fromAsync` | no | |
| Set methods (`union`, `intersection`, `isSubsetOf`...) | yes | |
| `Promise.withResolvers` / `Promise.try` / `allSettled` / `any` | yes | |
| `Error` `cause` / `AggregateError` / `Error.isError` | yes | |
| `Error.captureStackTrace` | no | |
| `WeakRef` / `FinalizationRegistry` | no | absent even in a bare `Context` |
| `Symbol.dispose` / `Symbol.asyncDispose` / `DisposableStack` | no | all `undefined` |
| `using` declarations | no | `SyntaxError: expecting ';'` |
| Iterator helpers / `Iterator.from` | yes | |
| RegExp `v` flag, `d` flag, named groups, lookbehind, modifiers `(?i:)`, duplicate named groups | yes | |
| `String.prototype.isWellFormed` / `replaceAll` | yes | |
| Resizable `ArrayBuffer` / `transfer` | yes | |
| `Atomics.waitAsync` | no | |
| `Float16Array` / `Math.f16round` / `Math.sumPrecise` | yes | |
| `Uint8Array` base64 / hex | yes | |
| `JSON.rawJSON` | yes | |
| `RegExp.escape` | yes | native one is standard; yavascript's override isn't (finding 2) |
| `Temporal` | no | |
| Top-level await, dynamic `import()`, import attributes `with { type: "json" }` | yes | |
| Class fields, `#private`, static blocks | yes | |
| `navigator` / `window` | no | expected for a non-browser runtime |

## Verified working

- **Global inventory:** 184 runtime globals were compared against the 110 top-level d.ts declarations. Every declared global exists at runtime (`Chmod` is a type-only namespace), and no declared function or class is a non-function at runtime.
- **Shapes matching the d.ts exactly:** the objects, instances and modules below match in both directions, apart from the differences listed in the Findings.
  - Objects: `yavascript`, `exit`, `pwd`, `sleep`, `exec`, `logger`, `JSX`, `YAML`, `CSV`, `TOML`, `assert`, `startRepl`, `process.versions`, `inspect`, `console`, `std`/`os` globals.
  - Instances: `GitRepo`, `InteractivePrompt`, `Context`, `Worker.prototype`, `FILE`.
  - Module-system surface: `require`, `import.meta`, `ModuleDelegate`.
  - Modules: `quickjs:timers`, `quickjs:std`, `quickjs:cmdline`, `quickjs:engine`, `quickjs:bytecode`, `quickjs:context`, `quickjs:encoding`, plus `TextEncoder`/`TextDecoder` instances.
  - `quickjs:os` differs only in the Windows-only functions, which are absent as documented.
- **Prototype and static extensions:** `String.prototype.grep`, `Array.prototype.grep`, `String.dedent`, `Promise.map` (concurrency 2), `Object.toPrimitive`, `Object.isPrimitive`, `String.cooked`.
- **Type definitions:** `yavascript.getTypesDts()` equals `--print-types` output, which equals `meta/npm/yavascript.d.ts`. The d.ts compiles cleanly under `lib: ["esnext"]` with `skipLibCheck: false`.
- **Doc links:** all 142 `{@link}` targets in the d.ts resolve to declared names, and no raw `{@link` text is left in the generated docs.
- **`inspect`:** basic output, key overload, `colours: 8`, `maxDepth`, `indent`.
- **Timers:** `setTimeout`/`clearTimeout`/`setInterval`/`clearInterval` (returns `[object Timer]`, `clearTimeout(undefined)` is safe), and `sleepAsync`.
- **`quickjs:std`:**
  - Files: `open`/`puts`/`printf`, `loadFile`, `isFILE`, `tmpfile`, `popen`, `fdopen`.
  - Environment and users: `getenv`/`setenv`/`unsetenv`/`getenviron`, uid/gid getters, `getpwuid`.
  - Parsing and formatting: `parseExtJSON`, `strftime` (Date and number), `sprintf` (returns a string).
  - Constants: all `SEEK_*` / `_IO*` / `BUFSIZ`.
- **`FILE` methods:** `target`, `close`, `puts`, `printf`, `flush`, `sync`, `seek` (number and bigint), `tell`, `tello`, `eof`, `fileno`, `read`, `write`, `writeTo`, `getline`, `readAsString(max)`, `getByte`, `putByte`, `setvbuf`.
- **`quickjs:os`** (all in the sandbox):
  - Files and directories: `open`/`read`/`write`/`seek`/`close`, `realpath`, `getcwd`, `chdir`, `mkdir`, `readdir`, `stat`, `lstat`, `symlink`, `readlink`, `utimes`, `rename`, `remove`, `access`, `chmod`.
  - Processes: `exec` (block and non-block), `kill` of a spawned child plus `waitpid` and all `W*` macros, `dup`/`dup2`/`pipe`, `getpid`.
  - Event loop: `setReadHandler`, `setWriteHandler`, `signal` (SIGUSR2 to self).
  - Misc: `sleep`, `now`, `platform`, `execPath`, `gethostname`, `isatty`, `ttyGetWinSize`; every `O_*`/`S_*`/`SIG*` constant is a number; `Win32Handle` exists.
  - `Worker` round trip (yavascript `Worker` subclasses `os.Worker`).
- **`quickjs:cmdline`:** `getScriptArgs`, `getExitCode`/`setExitCode` (reflected in `exit.code`).
- **`quickjs:engine`:**
  - Evaluation: `evalScript` (sync and async), `runScript`, `importModule`.
  - Modules: `resolveModule`, `isMainModule`, `isModuleNamespace`, `defineBuiltinModule`, `ModuleDelegate` (searchExtensions, compilers, builtinModuleNames).
  - Stacks: `getFileNameFromStack`, `getStackFrames`, `getStackFrameMapper`.
  - Misc: `gc`, `formatValue`, `__printObject` present.
- **`quickjs:bytecode`:** `fromValue`/`toValue` with cycles, errors with `serializeErrors`, and a throw without it; `fromFile` (module and script, runnable).
- **Contexts:** `quickjs:context` `Context` (`eval`, `globalThis`, `date: false`); the yavascript `Context` has yavascript globals by default.
- **`quickjs:encoding`:** `toUtf8`/`fromUtf8`, `TextEncoder`/`TextDecoder` (utf-8, shift_jis), `encodeInto`, `fatal` mode.
- **Module loading:** `require.resolve`, `require(..., { with: { type: "json" } })`, `import.meta` (`url`, `main`, `require`, `resolve`), top-level await, import attributes, dynamic import.
- **Misc:** `help()` prints a commit-pinned docs URL; `npm:` imports resolve via Skypack.
