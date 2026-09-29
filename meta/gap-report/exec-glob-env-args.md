# API audit: exec / $ / ChildProcess, glob, env / readEnvBool, parseScriptArgs / scriptArgs, openUrl

Binary: `./dist/yavascript` (version `git-d8cc554c0810`), macOS arm64. F2 was cross-checked on Linux by running `dist/bin/x86_64-unknown-linux-static/yavascript` inside the local `drive-ui-in-docker` image with `--network none`.

Repros run with the sandbox `.tmp/gap-update/exec/` as the working directory (`./dist/yavascript` means the repo's binary). Fixtures there: `g/` (glob tree with `a/b/c`, dotfiles, `weird[1]/`, `br{ace}/`, `q?mark/`, `sym/{link-to-a,loop,dead}`), `g3/` (`a*.js`, `ab.js`, and a file literally named `back\slash.js`), `printargs.sh` (prints each argv entry), and `psa.js` (prints scriptArgs and `parseScriptArgs()` when `SHOW_SCRIPTARGS=1`).

## Findings

### F1. [question] CLI / scriptArgs: `--lang` after the script filename is consumed by yavascript

- Repro: `./dist/yavascript psa.js --lang bogus` exits 3 with `Invalid --lang: "bogus".`; psa.js never runs. `psa.js --lang` exits 3 with `--lang requires an argument: The language to use.` `psa.js a --lang ts b` runs psa.js as TypeScript, and `parseScriptArgs()` gives `args: ["a","b"]`, `flags: {}`, even though `scriptArgs` still contains `--lang` and `ts`.
- Impact: a user script cannot accept its own `--lang` flag, which cuts against the "user scripts can define their own flags" intent in determine-target.ts:64-70. `-e`, `--eval` and `-r` after the filename are left for the script. Affects shebang scripts too.
- Cause: the `--lang` branch has no `hasFoundFileFromArgs` guard (src/layer5b/determine-target.ts:170-191), unlike `-e` at :151 and `-r` at :160. `something.js --lang coffee` is snapshot-tested as intended, so this is a **question**: it collides with script flags.

### F2. [doc-mismatch] exec: a spawn failure throws even with `failOnNonZeroStatus: false`, which the docs don't say

- Repro: `./dist/yavascript -e 'exec("no-such-cmd-xyz", { failOnNonZeroStatus: false })'` throws `Error: No such file or directory (errno = 2, file = no-such-cmd-xyz)`. A nonexistent `cwd` gives `(errno = 2, cwd = /nope/nope)`, a `cwd` pointing at a file gives `Not a directory (errno = 20, cwd = /etc/hosts)`, and a non-executable file or a directory gives `Permission denied (errno = 13, file = ./psa.js)`. Linux throws the same errors for the missing program, missing `cwd`, and non-executable cases.
- Docs: exec.inc.d.ts:59-61 says that when `failOnNonZeroStatus` is false "an object will be returned with `status` ... and `signal`", and nothing mentions that a program which can't be spawned throws regardless. `block: false` throws at the `exec()` call, not from `wait()`.

### F3. [bug] parseScriptArgs: `---` and `--!` become a flag named `""`

- Repro: `./dist/yavascript -e 'JSON.stringify(parseScriptArgs({}, ["---"]).flags)'` gives `{"":true}`. `--!` does the same.
- Expected: not a flag with an empty name (a lone `-` is already a positional arg).
- Cause: node_modules/clef-parse/dist/index.js:16-18 (`isFlag` accepts anything starting with `-` except `-` and negative numbers) and convert-case.js:6-11 (strips up to two dashes, then drops every part without letters or digits, leaving `""`).

### F4. [rough-edge] ChildProcess: `start()` can be called twice and silently spawns a second process

- Repro: `./dist/yavascript -e 'const cp = new ChildProcess("true"); const a = cp.start(); const b = cp.start(); cp.waitUntilComplete(); console.log(a === b)'` prints `false`. The first pid is lost and never reaped (zombie).
- Cause: no state guard in `start()` (src/layer1/api/exec/ChildProcess.ts:150).

### F5. [doc-mismatch] exec docs say `captureOutput: "utf-8"`; only `"utf8"` is accepted

- Repro: `./dist/yavascript -e 'exec("echo", { captureOutput: "utf-8" })'` throws `TypeError: when present, 'captureOutput' option must be either a boolean or one of the strings 'utf8' or 'arraybuffer'`.
- Source: src/layer1/api/exec/exec.inc.d.ts:55 (prose) vs :123 (type).

### F6. [doc-mismatch] exec / ChildProcess `env` option replaces the whole environment

- Repro: `./dist/yavascript -e 'logger.info=()=>{}; exec(["sh", "-c", "echo HOME=${HOME-unset}"], { env: { FOO: "1" } })'` prints `HOME=unset`.
- Docs: "Sets environment variables within the process" (exec.inc.d.ts:77) and "The environment variables for the process" (ChildProcess.inc.d.ts:87) read like a merge. Program lookup still uses the parent's PATH on macOS (`exec(["printenv"], { env: { ONLY: "this" } })` works) even though the child gets no PATH. The existing test `exec with env` shows replacement is intended, so this needs documenting, ideally with the `{ ...env, FOO: "1" }` idiom (verified working).

### F7. [doc-mismatch] `ChildProcessState` documents `STOPPED` and `CONTINUED` states that can never occur

- Repro: `./dist/yavascript -e 'const os = require("quickjs:os"); const cp = new ChildProcess(["sleep", "1"]); cp.start(); os.kill(cp.pid, os.SIGSTOP); sleep(100); console.log(cp.state.id); os.kill(cp.pid, 9); cp.waitUntilComplete()'` prints `STARTED` while the child is stopped (`ps` shows `T`). After SIGCONT it is also still `STARTED`.
- Cause: `waitpid` is called with `0` or `WNOHANG` only, never `WUNTRACED` (src/layer1/api/exec/ChildProcess.ts:222). `quickjs:os` now exposes `WUNTRACED`, but not `WCONTINUED`. Docs: ChildProcess.inc.d.ts:52-77.

### F8. [doc-mismatch] ChildProcessOptions says `logger.trace` writes to stderr; it's a no-op

- ChildProcess.inc.d.ts:110-111 says "`logger.trace` defaults to a function which writes to stderr". exec.inc.d.ts:94-95 and glob.inc.d.ts:53-54 correctly say no-op. Verified: `logger.trace.toString()` is `function noop() { [native code] }` (src/layer1/api/logger/logger.ts:25).

### F9. [doc-mismatch] glob `dir` must be absolute, which the docs don't say

- Repro: `./dist/yavascript -e 'glob("*", { dir: "g" })'` throws `'dir' option must be an absolute path, but received: "g"`. A relative Path throws too.
- Docs (glob.inc.d.ts:68-71): "Directory to interpret glob patterns relative to. Defaults to `pwd()`." Other APIs (exec `cwd`) accept relative paths. Cause: src/layer1/api/glob/glob.ts:229-236.

### F10. [doc-mismatch] parseScriptArgs docs and types lag the implementation

- `types.arrayOf(String|Number|Boolean|Path)` hints work at runtime (and are tested) but the declared `hints` type rejects them: `tsc` on `parseScriptArgs({ tags: types.arrayOf(String) })` gives `TS2322: Type 'TypeValidator<string[]>' is not assignable to type 'BooleanConstructor | NumberConstructor | StringConstructor | typeof Path'` (parse-script-args.inc.d.ts:62-67).
- `metadata.hints`/`metadata.guesses` are typed as `"path" | "number" | "boolean" | "string"` (:112, :125) but produce `"array of strings"`, `"array of booleans"`, etc. (`parseScriptArgs({}, ["-v","-v"]).metadata.guesses.v` is `"array of booleans"`).
- `flags` values are documented as "strings, booleans, numbers, or Paths" (:38-40) but repeated flags yield arrays.
- The docs call the second parameter `argv` (:15, :25) while the signature names it `args`.
- The docs say the default is `scriptArgs.slice(2)` (:28-31, :51-53), but it's the args the CLI hands to the script, which leaves out yavascript's own flags and the first `--`. So `psa.js a -- --foo` gives `scriptArgs` ending in `a -- --foo` while `parseScriptArgs()` sees `a --foo` and reports `flags: { foo: true }`.

### F11. [doc-mismatch] `scriptArgs` docs say "The first element is the script name"

- Actual: `scriptArgs[0]` is the yavascript binary, followed by yavascript's own flags and then the script: `./dist/yavascript --lang js psa.js --foo bar` gives `[".../dist/yavascript","--lang","js","psa.js","--foo","bar"]`. parseScriptArgs's own docs contradict it.
- Source: yavascript.d.ts:6365 and :6333, inherited from node_modules/@suchipi/quickjs/build/dts/quickjs-cmdline.d.ts:13 and :45.

### F12. [doc-mismatch] Typings reject documented or working usages

Checked with `tsc --strict` against yavascript.d.ts (`.tmp/gap-update/exec/types-check/check.ts`):
- `env.FOO = 5` gives `TS2322: Type 'number' is not assignable to type 'string'`, but the docs say "Any value you write will be coerced into a string" (env.inc.d.ts:5-7).
- `new ChildProcess("echo", { env: { N: 1 } })` is a type error (ChildProcess.inc.d.ts:88) while the runtime and exec's `env` type accept numbers and booleans.
- `const opts = { captureOutput: true }; exec("echo", opts).stdout` gives `Property 'stdout' does not exist on type 'void'` because the literal widens to `boolean`; this only works inline or with `as const`.

### F13. [doc-mismatch] exec string-parsing rules leave out behavior users will hit

Verified with `exec.toArgv`:
- Glob chars, `~`, `|`, `;`, `&&` are passed through literally (`echo a;b|c&&d` gives `["echo","a;b|c&&d"]`); the docs only mention env vars, subshells and redirection.
- A backslash outside quotes is kept literally and does not escape a space: `echo a\ b` gives `["echo","a\\","b"]`; `echo \"hi\"` throws `unterminated double-quote`.
- `\"` and `\'` escapes work inside either quote type (tested in to-argv.test.ts) but aren't in the documented escape list.
- `\0` is documented as an escape, but NUL cannot live in argv, so the arg is silently truncated: `exec(String.raw`./printargs.sh "a\0b"`)` prints `1: [a]`.

### F14. [doc-mismatch] glob docs omit result and traversal details

- Results are absolute `Path`s even for relative patterns.
- Order is raw readdir order, not sorted: `glob("*.js", { dir: ".../g" })` gives `top.js zeta.js 日本.js alpha.js sp ace.js`, while `sh -c 'echo *.js'` sorts.
- A negated pattern that matches a dir prunes its whole subtree: `glob(["**", "!a"])` omits `a/one.js` even though `a/one.js` does not match `a`.
- A negation-only pattern returns dot paths: `glob("!**/*.js")` includes `.hidden/h.js`.
- Unreadable entries produce `console.warn` output (see F21).
- Typo "expanstion" (glob.inc.d.ts:14).

### F15. [gap] exec has no stdin input and silently ignores unknown options

- `exec("cat", { stdin: "hello", captureOutput: true })` returns `{ stdout: "", stderr: "" }` with no error; `timeout: 5` is ignored the same way. The only way to feed data is `ChildProcess` with `stdio.in` set to a FILE.
- Stdin is inherited (piped data reaches the child), but anything the parent already buffered through `std.in` is lost to the child: after `std.in.getline()` read `line1`, `$("cat").stdout` was `""` instead of `line2\nline3\n`.

### F16. [gap] No timeouts or kill for exec; ChildProcess has no `kill()`; quickjs:os lacks SIGKILL

- The `block: false` result has only `wait` (`Object.keys(w)` gives `["wait"]`): no pid, no kill, no way to poll.
- `ChildProcess` exposes `pid`, so `os.kill(cp.pid, sig)` works, but `os.SIGKILL` and `os.SIGHUP` are `undefined`, and `os.kill(pid, undefined)` silently does nothing (the child ran to `status: 0`). Users must know to pass `9`.

### F17. [gap] No pipeline support

- `a | b` is only possible by hand with `os.pipe()`, `std.fdopen()`, two `ChildProcess`es, and closing the parent's copies (verified working in `.tmp/gap-update/exec/pipe.js`, giving `"HELLO\nWORLD\n"`). A bash replacement will be expected to offer this at a higher level.

### F18. [gap] captureOutput is all-or-nothing

- There's no way to capture stdout while letting stderr through to the terminal, or the reverse. When both are captured, their interleaving is lost (`echo 1; echo 2 >&2; echo 3` gives stdout `1\n3\n`, stderr `2\n`). No combined `2>&1` mode.

### F19. [gap] `$` silently ignores a second argument

- Repro: `./dist/yavascript -e 'logger.info=()=>{}; $("pwd", { cwd: "/usr" }).stdout'` prints the current directory, not `/usr`. There's no way to pass `cwd`/`env` to `$` (src/layer1/api/exec/exec.ts:226-234), and passing them is silently accepted at runtime.

### F20. [gap] parseScriptArgs lacks common CLI conventions

Verified:
- `--no-foo` gives `noFoo: true` even with a `foo: Boolean` hint.
- `-abc` gives flag `abc` (no bundling), and `-n5` gives flag `n5`.
- A Boolean hint only understands the literal `false`: `--v=0` gives `true`, and `--v no` gives `true` with `no` as a positional. readEnvBool accepts `0`/`FALSE`.
- There's no help/usage generation, no required flags, no unknown-flag errors, and no aliases.

### F21. [rough-edge] glob prints warnings with `console.warn` that the logging options cannot silence

- Repro: `glob("sym/*/x", { dir: ".../g", followSymlinks: true, logging: { trace() {}, info() {} } })` still prints `glob encountered error: No such file or directory (... sym/dead, linkpath = /nonexistent)`.
- Source: src/layer1/api/glob/glob.ts:371.

### F22. [rough-edge] exec's `exec: ...` info line misrenders some args, and its logging options are awkward

- An empty-string arg renders as nothing (`exec: "./printargs.sh"  "a b"`, with a double space), and `$HOME` is shown as `"$HOME"`, which would expand if pasted into sh (src/layer1/api/exec/exec.ts:101-105).
- `logging: { info: null }` throws `'options.logging.info' must be a function`, so a noop function is the only per-call way to silence it.
- With `trace` set, `exec error:` is logged twice per failure (exec.ts:204 and :219).

### F23. [rough-edge] Unhelpful errors for bad argv

- `exec([])` and `exec("")` throw `TypeError: invalid number of arguments`. More than 65535 args gives the same message.
- `ChildProcess` args errors are plain `Error` while option errors are `TypeError`.
- Failure errors (`Command failed: [...] (status = 3, signal = undefined)`) carry `stdout`/`stderr` props when captured, but the message omits stderr.

### F24. [rough-edge] Un-waited `block: false` children stay zombies; `openUrl` always leaves one

- Repro: `exec("true", { block: false }); sleep(200)`, then `ps` shows a `Z <defunct>` child of the yavascript pid. The temp files are also leaked if `captureOutput` was set.
- `openUrl` uses `block: false` and never waits (src/layer1/api/open-url/open-url.ts:8, 12, 18).

### F25. [rough-edge] openUrl: silent failures, flag injection, noisy output

Checked against src/layer1/api/open-url/open-url.ts rather than run, to avoid launching a browser; the argv errors were reproduced through `exec.toArgv(["open", ...])`, which is what openUrl hands to exec:
- A failing opener is ignored: the `block: false` result is never waited on, so a non-zero exit from `open`/`xdg-open` is never seen and `openUrl` returns normally.
- A value starting with `-` is passed as an option: `openUrl("--help")` runs `open --help`. That's risky for URLs from untrusted input.
- Each call prints `exec: open "<url>"` to stderr.
- `openUrl()` fails with `'args' argument must be either a string, a Path, or an array of strings/Paths/numbers (received = [ "open" undefined ])`, which leaks internals. `openUrl(5)` is accepted.

### F26. [rough-edge] parseScriptArgs values are fragile without hints

Verified:
- `--verbose file.txt` gives `verbose: "file.txt"`, so an unhinted boolean flag swallows the next positional.
- A value's type changes with repetition: `--tag a` gives a string, but `--tag a --tag b` gives an array, and `-v -v -v` gives `[true,true,true]`.
- A Number hint turns bad or missing values into `NaN` silently (`--count abc` and a bare `--count`).
- Path hints are not normalized: `--p ../x` gives `/Users/suchipi/Code/yavascript/.tmp/gap-update/exec/../x` (parse-script-args.ts:119-120, 128).
- An absent Boolean flag is `undefined` rather than `false`.

### F27. [rough-edge] env proxy edge cases

Verified:
- `env.hasOwnProperty("HOME")` throws `not a function`, and `String(env)` throws `failed to convert value to primitive`. `Object.hasOwn(env, ...)` works.
- Invalid names are silently no-ops: `env["A=B"] = "x"` and `env[""] = "x"`. A NUL in a value silently truncates it (`"a\0b"` becomes `"a"`).
- `Object.defineProperty(env, "X", ...)` doesn't set the real env var.
- Vars set through `require("quickjs:std").setenv` are readable via `env.X` but missing from `Object.keys(env)` and from child processes (`AUD_EXT=unset`). `ownKeys` does list them, but the proxy has no `getOwnPropertyDescriptor` trap, so `Object.keys` and the child env builder's `Object.entries` check each key against the startup snapshot in the proxy target (env.ts:4, :35-37, ChildProcess.ts:110).

### F28. [question] Relative program paths resolve against the child's `cwd`

- `exec("./printargs.sh a", { cwd: "/usr" })` fails with ENOENT, while it works without `cwd`. This matches `(cd /usr && ./printargs.sh)`, so it's probably intended, but it's undocumented. Worth a sentence in the `cwd` docs.

## Verified working

- exec string, array, and Path forms. Array args with spaces, quotes, unicode, empty strings, `$HOME`, and newlines arrive verbatim (checked with printargs.sh). Numbers and Paths inside arrays are stringified, and a Path is passed as a single argument even when it contains spaces.
- String parsing: whitespace splitting (space/tab/CR/LF/VT), quoted args, gluing adjacent quoted strings (`"a"'b'"c"` gives `abc`), `\n \r \t \v \\` inside quotes, a non-escape `\x` drops the backslash, trailing-backslash line continuations, and clear errors for unterminated quotes. Non-breaking space is not treated as a separator.
- `failOnNonZeroStatus`:
  - Default: throws `Command failed: ... (status = N, signal = undefined)` with `status`/`signal` props, plus `stdout`/`stderr` when captured.
  - `false`: returns `{ status, signal }`.
  - Signal deaths give `{ status: undefined, signal: 15/9/2 }`, and they throw by default.
- `captureOutput`:
  - `true`/`"utf8"` return strings. `"arraybuffer"` returns ArrayBuffers with exact bytes (`[255,254,0,65]`).
  - 10 MB of output is captured fully in both modes (tmpfile-based, no pipe deadlock).
  - UTF-8 multibyte is decoded, and invalid UTF-8 becomes U+FFFD.
- `block: false`: returns `{ wait }`, and `wait()` returns the documented shapes, including when called twice. Two concurrent non-blocking processes finish independently.
- `cwd` works as an absolute string, a relative string, or a Path; a non-string/Path value gives a clear TypeError.
- `env` option: number and boolean values are coerced, null/undefined values are dropped, and `{ ...env, X }` merges.
- Options type checks: `options` null, `failOnNonZeroStatus: "false"`, and bad `captureOutput` all give clear TypeErrors.
- Logging: `logging.info` and `logging.trace` are called as documented. The default `logger.info` prints `exec: ...` to stderr, and `logger.trace` defaults to a noop.
- Output order: stdout from the script, from `echo()` and from child processes stays in order when stdout is a pipe or a file.
- `$` returns `{ stdout, stderr }` without trimming, matching the doc example (`"hi\n"`). All exec doc examples run as documented.
- `exec.toArgv` is exposed and matches exec's parsing.
- ChildProcess:
  - Defaults: `args`, `cwd` = pwd, env snapshot at construction, `std.in/out/err`, `UNSTARTED`, and `pid: null`.
  - `args`, `env`, and `cwd` can be mutated before `start()`.
  - `start()` returns the pid, and states move through UNSTARTED, STARTED, EXITED/SIGNALED with `oldPid`.
  - `waitUntilComplete()` before `start()` gives a clear error. It throws ECHILD (rather than hanging) if the child was already reaped elsewhere.
  - `stdio.in/out/err` accept FILE redirection, including out and err pointed at the same file with interleaving kept. A non-FILE stdio value gives a clear TypeError.
- glob:
  - Wildcards: `*`, `**`, `?`, `[tz]`, `[!tz]`, braces (including `{a/b,node_modules/pkg}`), and extglob `+()` / `@()` / `!()`.
  - Dotfiles need an explicit leading dot (`.*`, `.hidden/*`), and `**` skips dot dirs.
  - `!` negation with AND semantics, partial-match pruning, and trailing `**` not matching its parent dir all work.
  - `followSymlinks: false` does not traverse symlinks (dead links are listed). `followSymlinks: true` goes through links, stops at cycles, and warns and continues on dead links.
  - Unicode and space-containing names match, and so do cwd or `dir` paths containing `[`. Patterns matching nothing give `[]`, and a nonexistent `dir` gives a clear error.
  - A file named `back\slash.js` is matched by `back\\slash.js` (relative or absolute) and by `back*`, and comes back with the `\` intact.
  - An absolute pattern without wildcards in its dir part infers the start dir. Results are Path objects, and `glob("")` throws `Invalid glob pattern`.
  - An unreadable subdirectory is skipped and the process still exits 0.
- env: reads, sets (numbers, booleans, objects, and arrays coerced to strings), `delete`, null/undefined assignment unsets, empty-string values (read as `""` and passed to children), case-sensitive keys, `in`, `Object.keys`, spread, and JSON all work. Changes are visible to child processes.
- readEnvBool: `1/true/True/TRUE` give true and `0/false/False/FALSE` give false. Unset gives the fallback silently. `yes/no/on/off/tRuE/" true"/2/-1` warn and return the fallback. A `logging.warn` override is used, and a global `logger.warn` override is honored. With no `warn`, it stays silent.
- parseScriptArgs:
  - `--like-this`, `--like_this`, `--LIKE_THIS`, and `--fooBar` all become camelCase, and `-v` becomes `v`. Non-ASCII names like `--héllo` are kept.
  - `--` ends flags (it is not included in `args`, and a second `--` is dropped).
  - `--foo=a=b` gives `a=b`, and `--foo=` gives `""`.
  - Negative numbers and a lone `-` are positional args.
  - Hints work: String/Boolean/Number/Path and `types.arrayOf(...)`, including a Number hint accepting `-5`. A String or Path hint with no value throws an error naming the flag.
  - Repeated flags merge into arrays, `metadata.keys` is populated, and invalid `hints`/`args` give clear TypeErrors.
  - Unhinted values: `007`, `1e3`, and `0x10` stay strings.
  - With `-e`, `--lang` or `-r`, the default args leave out yavascript's own flags and the eval code.
- openUrl (fake `open` on PATH): passes the URL/path verbatim as one argv entry (`https://example.com/?a=1&b=2`, `dir with space/prog`, `code.txt`) and returns `undefined`. A missing opener gives a named error.

## Test coverage notes

- exec.test.ts has no tests for:
  - signal-killed processes
  - nonexistent program, bad `cwd`, or non-executable file (F2)
  - `exec([])`/`exec("")`
  - `env` merge vs replace documented as a contract
  - stdin inheritance
  - large or binary output
- to-argv.test.ts misses: backslash-space outside quotes, `\0` in real argv, and the empty string.
- ChildProcess.test.ts covers only the happy path and state polling. Untested: `stdio` options, SIGNALED state, custom `env`/`cwd`, calling `start()` twice, `waitUntilComplete()` before `start()`, and invalid options.
- glob.test.ts has no tests for:
  - result ordering
  - relative `dir` (F9)
  - multiple absolute patterns with different roots
- env.test.ts has no tests for `null`/`undefined` assignment or non-string coercion. readEnvBool coverage is good.
- parse-script-args.test.ts has no tests for `--no-*`, missing values, NaN, or Path normalization.
- openUrl has no functional test. It only appears in the globals listing (globals.test.ts:178, context.test.ts:178). A fake-`open`-on-PATH test would cover argv, the non-blocking behavior, and error handling without opening a browser.
