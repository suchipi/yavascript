# API audit: exec / $ / ChildProcess, glob, env / readEnvBool, parseScriptArgs / scriptArgs, openUrl

Binary: `./dist/yavascript` (version `git-3eedd831a85c`), macOS arm64. A few items were cross-checked on Linux by running `dist/bin/x86_64-unknown-linux-static/yavascript` inside the local `drive-ui-in-docker` image with `--network none`.

All repros run from the repo root. Fixtures live in `.tmp/api-audit/exec-sandbox/`: `g/` (glob tree with `a/b/c`, dotfiles, `weird[1]/`, `br{ace}/`, `q?mark/`, `sym/{link-to-a,loop,dead}`), `g2/noperm` (unreadable dir), `dir with space/prog`, `printargs.sh` (prints each argv entry), `psa.js` (prints scriptArgs and `parseScriptArgs()` when `SHOW_SCRIPTARGS=1`), and `fakebin/open` (records its args to `open.log`). `repros.sh` re-runs most repros below and `repros.out` holds its output.

## Findings

### F1. [bug] exec / $ / ChildProcess: child output jumps ahead of the script's own output when stdout is a pipe or file

- Repro: `./dist/yavascript -e 'console.log(1); exec("echo 2"); console.log(3)' 2>/dev/null | cat`
- Expected: `1`, `2`, `3`. Actual: `2`, `1`, `3`. Same with `> file`, with `echo()` instead of `console.log`, and on Linux. Calling `require("quickjs:std").out.flush()` before `exec` fixes it.
- Impact: any script whose output is redirected (CI logs, `| tee`, `> out.txt`) gets its lines reordered around every subprocess.
- Cause: `ChildProcess.start` spawns without flushing `std.out`/`std.err` (src/layer1/api/exec/ChildProcess.ts:150-160); QuickJS stdout is fully buffered when not a TTY.

### F2. [bug] glob (root cause in QuickJS `os.readdir`): any readdir error makes the process abort at exit with code 134

- Repro A (error caught by user): `./dist/yavascript -e 'try { glob("*", { dir: "/etc/hosts" }) } catch (e) { console.log("caught") }'`
- Repro B (error swallowed inside glob): `chmod 000 .tmp/api-audit/exec-sandbox/g2/noperm; ./dist/yavascript -e 'logger.info=()=>{}; console.log(glob("**", { dir: pwd().concat(".tmp/api-audit/exec-sandbox/g2") }).length)'; chmod 755 .tmp/api-audit/exec-sandbox/g2/noperm`
- Expected: exit 0. Actual (both): script finishes (`caught` / `3`), then `Assertion failed: (list_empty(&rt->gc_obj_list)), function JS_FreeRuntime, file /opt/quickjs/src/quickjs/quickjs.c, line 2475.` and exit 134 (SIGABRT).
- Impact: `glob("**")` over any tree with one unreadable dir kills the script's exit status even though glob returned normally. Also hit by F10 (absolute file pattern) when caught.
- Cause: `js_os_readdir` allocates `array` and never frees it on the `opendir`/`readdir` error paths (/Users/suchipi/Code/quickjs/src/builtin-modules/quickjs-os/quickjs-os.c:692-705 and 713-718, local checkout at 0.16.2, same version as node_modules). `try { require("quickjs:os").readdir("/nope") } catch {}` alone reproduces it.

### F3. [bug] CLI / scriptArgs: `-e`/`--eval` after the script filename hijacks the run; `--lang` after it is also consumed

- Repro: `./dist/yavascript .tmp/api-audit/exec-sandbox/psa.js -e 'console.log("hijacked")'`
- Expected: psa.js runs and sees `-e` in scriptArgs (this is how `-r` already behaves after the filename). Actual: prints `hijacked`; psa.js never runs. `psa.js --eval` exits 3 with `--eval requires an argument`. `psa.js --lang bogus` exits 3 with `Invalid --lang: "bogus"`.
- Impact: a user script cannot accept `-e`, `--eval`, or `--lang` flags, contradicting the "user scripts can define their own flags" intent in determine-target.ts:47-53. Affects shebang scripts too.
- Cause: src/layer5b/determine-target.ts:126-134 (`-e` has no `hasFoundFileFromArgs` guard, unlike `-r` at :135) and :173 (eval wins over file). `--lang` after the file is snapshot-tested as intended (`something.js --lang coffee`), so that half is a **question**: it collides with script flags.

### F4. [bug] parseScriptArgs: default argv is wrong whenever yavascript was invoked with `-e`, `--lang`, or `-r`

- Repro: `./dist/yavascript -e 'console.log(JSON.stringify(parseScriptArgs().args))' a b`
- Expected: `["a","b"]`. Actual: `["console.log(JSON.stringify(parseScriptArgs().args))","a","b"]`.
- Repro 2: `env SHOW_SCRIPTARGS=1 ./dist/yavascript --lang js .tmp/api-audit/exec-sandbox/psa.js --foo bar` gives `args: ["js", ".tmp/api-audit/exec-sandbox/psa.js"]`.
- Cause: hardcoded `scriptArgs.slice(2)` (src/layer1/api/parse-script-args/parse-script-args.ts:17); the docs (parse-script-args.inc.d.ts:28-30) promise it skips "the yavascript binary and script name".

### F5. [bug] env: empty-string variables read as `undefined` and are dropped from child processes

- Repro: `env EMPTY= ./dist/yavascript -e 'console.log(env.EMPTY, "EMPTY" in env)'` prints `undefined true`.
- Repro 2: `env EMPTY= ./dist/yavascript -e 'logger.info=()=>{}; exec(["sh", "-c", "echo EMPTY=${EMPTY-unset}"])'` prints `EMPTY=unset` (expected `EMPTY=`). Same after `env.X = ""` in-script. Passing `env: { E: "" }` explicitly does work.
- Impact: `env.X === ""` is never true; set-but-empty vars (a common "defined" flag) vanish for every subprocess.
- Cause: `std.getenv(property) || undefined` (src/layer1/api/env/env.ts:9) combined with the `value != null` filter in src/layer1/api/exec/ChildProcess.ts:110-114.

### F6. [bug] exec: spawn failures behave differently on macOS vs Linux, and the macOS error never names what failed

- macOS repro: `./dist/yavascript -e 'exec("no-such-cmd-xyz", { failOnNonZeroStatus: false })'` throws `TypeError: posix_spawn error: No such file or directory`. Nonexistent `cwd`, and `cwd` pointing at a file, give the identical message; a non-executable file or a directory gives `posix_spawn error: Permission denied`.
- Linux repro: `docker run --rm --network none --entrypoint /y/yavascript -v "$PWD/dist/bin/x86_64-unknown-linux-static:/y:ro" drive-ui-in-docker:latest -e 'logger.info=()=>{}; console.log(inspect(exec("definitely-not-a-cmd", {failOnNonZeroStatus: false})))'` returns `{ status: 127, signal: undefined }`; with defaults it throws `Command failed: "definitely-not-a-cmd" (status = 127, signal = undefined)`. Bad cwd and non-executable also give status 127.
- Expected: one documented behavior on all platforms, with an error that names the program (and cwd when that is the problem). `failOnNonZeroStatus: false` should not throw on one OS and return on another.
- Cause: QuickJS `os.exec` uses posix_spawn on Apple and throws (quickjs-os.c:2911-2914); on other Unixes it forks and the child does `_exit(127)` (quickjs-os.c:3031-3050).

### F7. [bug] exec / exec.toArgv / ChildProcess: a `Path` argument is word-split like a command string

- Repro: `./dist/yavascript -e 'JSON.stringify(exec.toArgv(new Path("/a b/c")))'` gives `["/a","b/c"]`.
- Repro 2: `./dist/yavascript -e "exec(new Path(pwd(), '.tmp/api-audit/exec-sandbox/dir with space/prog'))"` throws `posix_spawn error: No such file or directory`; the info line shows `exec: "/Users/.../exec-sandbox/dir" with space/prog`.
- Expected: a Path is one program path. Passing it inside an array works.
- Cause: src/layer1/api/exec/to-argv.ts:13-14 turns the Path into a string and runs it through the shell-like parser.

### F8. [bug] exec string parsing: `\\` right before a closing quote is treated as an escaped quote

- Repro: ``./dist/yavascript -e 'exec.toArgv(String.raw`echo "a\\"`)'``
- Expected: `["echo", "a\\"]` (docs list `\\` as a supported escape). Actual: `Error: Invalid command-line string: unterminated double-quote: echo "a\\"`. Same for single quotes. Hits Windows-style paths like `"C:\\dir\\"`.
- Cause: the closing-quote checks look at `prevChar === "\\"` without knowing that backslash was consumed as part of `\\` (src/layer1/api/exec/to-argv.ts:69 and :82).

### F9. [bug] glob: patterns silently match nothing when `dir` or the cwd contains glob metacharacters

- Repro: `./dist/yavascript -e "logger.info=()=>{}; cd('.tmp/api-audit/exec-sandbox/g/weird[1]'); console.log(JSON.stringify(glob('*').map(String)))"` prints `[]` (the dir contains `w.js`). `glob("*", { dir: ".../weird[1]" })` also gives `[]`.
- Impact: every relative glob breaks inside dirs like `Photos [2020]`; a dir containing `{a,b}` or `*` would also misbehave.
- Cause: the starting dir is concatenated unescaped into the minimatch pattern (src/layer1/api/glob/glob.ts:21-25).

### F10. [bug] glob: absolute patterns with a literal file, or with `?`/`[...]` in their first wildcard segment, throw

- Repro: `./dist/yavascript -e 'glob(pwd().toString() + "/package.json")'` throws `Error: Not a directory (errno = 20, path = .../package.json)` (and per F2 aborts with 134 if caught). The relative `glob("package.json")` works.
- Repro 2: `./dist/yavascript -e 'glob(pwd().toString() + "/sr?/*.ts")'` throws `No such directory: /Users/suchipi/Code/yavascript/sr? (from ...)`. `/[a]/*.js` behaves the same way.
- Cause: the inferred start dir takes every segment without `*`, `{`, `}`, `+(` or a leading `!` (`HAS_GLOB_METACHARS_RE`, src/layer1/api/glob/glob.ts:44), so `?`, `[`, `@(`, `?(` segments and full file paths become the "dir" (glob.ts:104-117).

### F11. [bug] glob: `glob([])` returns the entire tree

- Repro: `./dist/yavascript -e "logger.info=()=>{}; console.log(glob([], { dir: pwd().concat('.tmp/api-audit/exec-sandbox/g') }).length)"` prints `29` (every file and dir, dotfiles included).
- Expected: `[]`. With AND semantics, an empty pattern list is vacuously true for every path, and nothing prunes traversal, so a `glob(userList)` call with an empty list walks everything under cwd.
- Cause: `allPatterns.every(...)` on an empty array (src/layer1/api/glob/glob.ts:220).

### F12. [bug] glob: patterns that start with `../` never match

- Repro: `./dist/yavascript -e "logger.info=()=>{}; cd('.tmp/api-audit/exec-sandbox/g/a'); console.log(JSON.stringify(glob('../*.js').map(String)))"` prints `[]` (parent has five `.js` files). `sh -c 'echo ../*.js'` finds them.
- Cause: the pattern is normalized to the parent dir, but traversal only descends from `dir` (src/layer1/api/glob/glob.ts:21-25, 290).

### F13. [bug] glob: backslash escaping does not work on POSIX, and `\` acts as a path separator

- Repro: `glob("weird\\[1\\]/*", { dir: ".../g" })` returns `[]`. `glob("a\\*.js")` (a literal backslash in the pattern) returns `.../g/a/one.js`.
- Expected: minimatch escapes (`\[` matches a literal `[`), and `\` as a filename character on POSIX. The only working escape is `weird[[]1[]]/*`.
- Cause: `Path.normalize` splits on `\` (`Path.normalize("/x", "./weird\\[1\\]/*")` gives `/x/weird/[1/]/*`) before minimatch sees it (glob.ts:21-25).

### F14. [bug] glob: extglob `!(...)` at the start of a pattern is treated as a negation

- Repro: `glob("!(*.js)", { dir: ".../g/a" })` returns `["one.js","two.ts","b","three.js","c","four.js"]`, which includes the `.js` files it should exclude.
- Cause: any leading `!` is stripped as a negation marker (src/layer1/api/glob/glob.ts:16-19, 178), leaving the literal pattern `(*.js)`.

### F15. [bug] glob: a trailing slash does not limit matches to directories

- Repro: `glob("*/", { dir: ".../g/a" })` returns `["one.js","two.ts","b"]`. `a/**/` also returns files.
- Expected (per the glob(7) page the docs link): only `b`.
- Cause: `Path.normalize` drops the trailing slash (`Path.normalize("/x", "./*/")` gives `/x/*`), glob.ts:21-25.

### F16. [bug] glob `followSymlinks: true` has no cycle detection

- Repro: `./dist/yavascript -e "logger.info=()=>{}; console.log(glob('sym/**', { dir: pwd().concat('.tmp/api-audit/exec-sandbox/g'), followSymlinks: true }).length)"` (fixture has `sym/loop -> .`) prints `256` plus 35 `glob encountered error:` lines, stopping only when the OS returns ELOOP (`sym/loop/loop/.../loop` 32 levels deep).
- Cause: `os.stat` follows links and nothing records visited dir identities (src/layer1/api/glob/glob.ts:208-209, 274-276).

### F17. [bug] exec `block: false`: calling `wait()` twice with `captureOutput` throws

- Repro: `./dist/yavascript -e 'logger.info=()=>{}; const w = exec("echo hi", { block: false, captureOutput: true }); w.wait(); w.wait()'`
- Expected: the same result again, or a clear error. Actual: `TypeError: invalid file handle`. Without captureOutput, a second `wait()` works (and rethrows the same error for non-zero exits).
- Cause: the temp files are closed in `wait()`'s `finally` (src/layer1/api/exec/exec.ts:180-183) but a second call re-reads and re-closes them.

### F18. [bug] exec string parsing: `"foo"bar` splits into two args while `foo"bar"` glues

- Repro: ``./dist/yavascript -e 'JSON.stringify(exec.toArgv(`echo "foo"bar foo"bar"`))'`` gives `["echo","foo","bar","foobar"]`.
- Expected (sh semantics, and symmetry): `["echo","foobar","foobar"]`.
- Cause: a closing quote pushes the arg unless the next char is another quote (src/layer1/api/exec/to-argv.ts:73-76, 86-89).

### F19. [bug] parseScriptArgs: negative numbers become flags, and `--x=-5` loses its value

- Repro: `./dist/yavascript -e 'JSON.stringify(parseScriptArgs({}, ["--count=-5", "-3"]).flags)'` gives `{"3":true,"count":true}`.
- Also: `["--count", "-5"]` without a hint gives `{"5":true,"count":true}`. With `{ count: Number }` it gives `-5` correctly. A positional `-5` always becomes flag `"5"`.
- Cause: clef-parse `bestGuess` treats any value starting with `-` as "no value, so Boolean", even for the explicit `=` form (node_modules/clef-parse/dist/index.js:20-21, 159-161, 172-186).

### F20. [bug] parseScriptArgs: lone `-` becomes a flag named `""`, and non-ASCII flag names get mangled

- Repro: `./dist/yavascript -e 'JSON.stringify(parseScriptArgs({}, ["-", "--héllo"]).flags)'` gives `{"":true,"hLlo":true}`.
- Expected: `-` (conventionally stdin) is a positional arg; `--héllo` maps to `héllo`. `---` and `--!` also produce flag `""`.
- Cause: node_modules/clef-parse/dist/index.js:139 (anything starting with `-` is a flag) and convert-case.js:9 (`\b` split is ASCII-only).

### F21. [rough-edge] ChildProcess: `start()` can be called twice and silently spawns a second process

- Repro: `./dist/yavascript -e 'const cp = new ChildProcess("true"); const a = cp.start(); const b = cp.start(); cp.waitUntilComplete(); console.log(a === b)'` prints `false`. The first pid is lost and never reaped (zombie).
- Cause: no state guard in `start()` (src/layer1/api/exec/ChildProcess.ts:150).

### F22. [doc-mismatch] exec docs say `captureOutput: "utf-8"`; only `"utf8"` is accepted

- Repro: `./dist/yavascript -e 'exec("echo", { captureOutput: "utf-8" })'` throws `TypeError: when present, 'captureOutput' option must be either a boolean or one of the strings 'utf8' or 'arraybuffer'`.
- Source: src/layer1/api/exec/exec.inc.d.ts:55 (prose) vs :123 (type).

### F23. [doc-mismatch] exec / ChildProcess `env` option replaces the whole environment

- Repro: `./dist/yavascript -e 'logger.info=()=>{}; exec(["sh", "-c", "echo HOME=${HOME-unset}"], { env: { FOO: "1" } })'` prints `HOME=unset`.
- Docs: "Sets environment variables within the process" (exec.inc.d.ts:77) and "The environment variables for the process" (ChildProcess.inc.d.ts:87) read like a merge. Program lookup still uses the parent's PATH on macOS (`exec(["printenv"], { env: { ONLY: "this" } })` works) even though the child gets no PATH. The existing test `exec with env` shows replacement is intended, so this needs documenting, ideally with the `{ ...env, FOO: "1" }` idiom (verified working).

### F24. [doc-mismatch] `ChildProcessState` documents `STOPPED` and `CONTINUED` states that can never occur

- Repro: `./dist/yavascript -e 'const os = require("quickjs:os"); const cp = new ChildProcess(["sleep", "1"]); cp.start(); os.kill(cp.pid, os.SIGSTOP); sleep(100); console.log(cp.state.id); os.kill(cp.pid, 9); cp.waitUntilComplete()'` prints `STARTED` while the child is stopped (`ps` shows `T`). After SIGCONT it is also still `STARTED`.
- Cause: `waitpid` is called with `0` or `WNOHANG` only, never `WUNTRACED` (and `WCONTINUED` isn't exposed by quickjs:os), src/layer1/api/exec/ChildProcess.ts:217. Docs: ChildProcess.inc.d.ts:52-77.

### F25. [doc-mismatch] ChildProcessOptions says `logger.trace` writes to stderr; it's a no-op

- ChildProcess.inc.d.ts:110-111 says "`logger.trace` defaults to a function which writes to stderr". exec.inc.d.ts:94-95 and glob.inc.d.ts:53-54 correctly say no-op. Verified: `logger.trace.toString()` is `function noop() { [native code] }` (src/layer1/api/logger/logger.ts:19).

### F26. [doc-mismatch] glob `dir` must be absolute, which the docs don't say

- Repro: `./dist/yavascript -e 'glob("*", { dir: "src" })'` throws `'dir' option must be an absolute path, but received: "src"`. A relative Path throws too.
- Docs (glob.inc.d.ts:68-71): "Directory to interpret glob patterns relative to. Defaults to `pwd()`." Other APIs (exec `cwd`) accept relative paths. Cause: src/layer1/api/glob/glob.ts:168-173.

### F27. [doc-mismatch] parseScriptArgs docs and types lag the implementation

- `types.arrayOf(String|Number|Boolean|Path)` hints work at runtime (and are tested) but the declared `hints` type rejects them: `tsc` on `parseScriptArgs({ tags: types.arrayOf(String) })` gives `TS2322: Type 'TypeValidator<string[]>' is not assignable to type 'BooleanConstructor | NumberConstructor | StringConstructor | typeof Path'` (parse-script-args.inc.d.ts:62-67).
- `metadata.hints`/`metadata.guesses` are typed as `"path" | "number" | "boolean" | "string"` (:112, :125) but produce `"array of strings"`, `"array of booleans"`, etc. (`parseScriptArgs({}, ["-v","-v"]).metadata.guesses.v` is `"array of booleans"`).
- `flags` values are documented as "strings, booleans, numbers, or Paths" (:38-40) but repeated flags yield arrays.
- The docs call the second parameter `argv` (:15, :25) while the signature names it `args`.

### F28. [doc-mismatch] `scriptArgs` docs say "The first element is the script name"

- Actual: `scriptArgs[0]` is the yavascript binary and `[1]` is the script (see F4 repro 2 output: `["./dist/yavascript","--lang","js",".../psa.js","--foo","bar"]`). parseScriptArgs's own docs contradict it.
- Source: yavascript.d.ts:6358 and :6326, inherited from node_modules/@suchipi/quickjs/build/dts/quickjs-cmdline.d.ts:13 and :45.

### F29. [doc-mismatch] Typings reject documented or working usages

Checked with `tsc --strict` against yavascript.d.ts (`.tmp/api-audit/exec-sandbox/types-check/check.ts`):
- `env.FOO = 5` gives `TS2322: Type 'number' is not assignable to type 'string'`, but the docs say "Any value you write will be coerced into a string" (env.inc.d.ts:5-7).
- `new ChildProcess("echo", { env: { N: 1 } })` is a type error (ChildProcess.inc.d.ts:88) while the runtime and exec's `env` type accept numbers and booleans.
- `const opts = { captureOutput: true }; exec("echo", opts).stdout` gives `Property 'stdout' does not exist on type 'void'` because the literal widens to `boolean`; this only works inline or with `as const`.

### F30. [doc-mismatch] exec string-parsing rules leave out behavior users will hit

Verified with `exec.toArgv`:
- Glob chars, `~`, `|`, `;`, `&&` are passed through literally (`echo a;b|c&&d` gives `["echo","a;b|c&&d"]`); the docs only mention env vars, subshells and redirection.
- A backslash outside quotes is kept literally and does not escape a space: `echo a\ b` gives `["echo","a\\","b"]`; `echo \"hi\"` throws `unterminated double-quote`.
- `\"` and `\'` escapes work inside either quote type (tested in to-argv.test.ts) but aren't in the documented escape list.
- `\0` is documented as an escape, but NUL cannot live in argv, so the arg is silently truncated: `exec(String.raw`.tmp/api-audit/exec-sandbox/printargs.sh "a\0b"`)` prints `1: [a]`.

### F31. [doc-mismatch] glob docs omit result and traversal details

- Results are absolute `Path`s even for relative patterns.
- Order is raw readdir order, not sorted: `glob("*.js", { dir: ".../g" })` gives `top.js zeta.js 日本.js alpha.js sp ace.js`, while `sh -c 'echo *.js'` sorts.
- A negated pattern that matches a dir prunes its whole subtree: `glob(["**", "!a"])` omits `a/one.js` even though `a/one.js` does not match `a`.
- A negation-only pattern returns dot paths: `glob("!**/*.js")` includes `.hidden/h.js`.
- Unreadable entries produce `console.warn` output (see F38).
- Typo "expanstion" (glob.inc.d.ts:14).

### F32. [gap] exec has no stdin input and silently ignores unknown options

- `exec("cat", { stdin: "hello", captureOutput: true })` returns `{ stdout: "", stderr: "" }` with no error; `timeout: 5` is ignored the same way. The only way to feed data is `ChildProcess` with `stdio.in` set to a FILE.
- Stdin is inherited (piped data reaches the child), but anything the parent already buffered through `std.in` is lost to the child: after `std.in.getline()` read `line1`, `$("cat").stdout` was `""` instead of `line2\nline3\n`.

### F33. [gap] No timeouts or kill for exec; ChildProcess has no `kill()`; quickjs:os lacks SIGKILL

- The `block: false` result has only `wait` (`Object.keys(w)` gives `["wait"]`): no pid, no kill, no way to poll.
- `ChildProcess` exposes `pid`, so `os.kill(cp.pid, sig)` works, but `os.SIGKILL` and `os.SIGHUP` are `undefined`, and `os.kill(pid, undefined)` silently does nothing (the child ran to `status: 0`). Users must know to pass `9`.

### F34. [gap] No pipeline support

- `a | b` is only possible by hand with `os.pipe()`, `std.fdopen()`, two `ChildProcess`es, and closing the parent's copies (verified working in `.tmp/api-audit/exec-sandbox/pipe.js`, giving `"HELLO\nWORLD\n"`). A bash replacement will be expected to offer this at a higher level.

### F35. [gap] captureOutput is all-or-nothing

- There's no way to capture stdout while letting stderr through to the terminal, or the reverse. When both are captured, their interleaving is lost (`echo 1; echo 2 >&2; echo 3` gives stdout `1\n3\n`, stderr `2\n`). No combined `2>&1` mode.

### F36. [gap] `$` silently ignores a second argument

- Repro: `./dist/yavascript -e 'logger.info=()=>{}; $("pwd", { cwd: "/usr" }).stdout'` prints the repo root. There's no way to pass `cwd`/`env` to `$` (src/layer1/api/exec/exec.ts:200-208), and passing them is silently accepted at runtime.

### F37. [gap] parseScriptArgs lacks common CLI conventions

Verified:
- `--no-foo` gives `noFoo: true` even with a `foo: Boolean` hint.
- `-abc` gives flag `abc` (no bundling), and `-n5` gives flag `n5`.
- A Boolean hint only understands the literal `false`: `--v=0` gives `true`, and `--v no` gives `true` with `no` as a positional. readEnvBool accepts `0`/`FALSE`.
- There's no help/usage generation, no required flags, no unknown-flag errors, and no aliases.

### F38. [rough-edge] glob prints warnings with `console.warn` that the logging options cannot silence

- Repro: `glob("sym/*/x", { dir: ".../g", followSymlinks: true, logging: { trace() {}, info() {} } })` still prints `glob encountered error: No such file or directory (... sym/dead, linkpath = /nonexistent)`.
- Source: src/layer1/api/glob/glob.ts:282.

### F39. [rough-edge] exec's default `exec: ...` info line always contains ANSI codes

- Repro: `NO_COLOR=1 CLICOLOR=0 ./dist/yavascript -e 'exec("true")' 2>&1 | od -c | head -1` shows `033 [ 2 m e x e c : ...`. Every `exec`/`$`/`openUrl` writes this to stderr, so log files fill with escape codes.
- Cause (outside this area): logger.info uses `dim()` (src/layer1/api/logger/logger.ts:15), and strings.ts:5 forces `kleur.enabled = true`.
- Related: an empty-string arg renders as nothing (`exec: "./printargs.sh"  "a b"`, with a double space), and `$HOME` is shown as `"$HOME"`, which would expand if pasted into sh (exec.ts:88-92).
- Related: `logging: { info: null }` throws `'options.logging.info' must be a function`, so a noop function is the only per-call way to silence it.
- Related: with `trace` set, `exec error:` is logged twice per failure (exec.ts:178 and :193).

### F40. [rough-edge] Unhelpful errors for bad argv

- `exec([])` and `exec("")` throw `TypeError: invalid number of arguments`. More than 65535 args gives the same message.
- `ChildProcess` args errors are plain `Error` while option errors are `TypeError`.
- Failure errors (`Command failed: [...] (status = 3, signal = undefined)`) carry `stdout`/`stderr` props when captured, but the message omits stderr.

### F41. [rough-edge] Un-waited `block: false` children stay zombies; `openUrl` always leaves one

- Repro: `exec("true", { block: false }); sleep(200)`, then `ps` shows a `Z <defunct>` child of the yavascript pid. The temp files are also leaked if `captureOutput` was set.
- `openUrl` uses `block: false` and never waits (src/layer1/api/open-url/open-url.ts:8, 12, 18).

### F42. [rough-edge] openUrl: silent failures, flag injection, noisy output

Tested with a fake `open` at the front of PATH:
- A failing opener is ignored: with `FAKE_OPEN_EXIT=1`, `openUrl("x")` still returns normally.
- A value starting with `-` is passed as an option: `openUrl("--help")` ran `open --help`. That's risky for URLs from untrusted input.
- Each call prints `exec: open "<url>"` to stderr.
- `openUrl()` fails with `'args' argument must be either a string, a Path, or an array of strings/Paths/numbers (received = [ "open" undefined ])`, which leaks internals. `openUrl(5)` is accepted.
- A missing `open`/`xdg-open` gives the bare `posix_spawn error: No such file or directory`.

### F43. [rough-edge] parseScriptArgs values are fragile without hints

Verified:
- `--verbose file.txt` gives `verbose: "file.txt"`, so an unhinted boolean flag swallows the next positional.
- A value's type changes with repetition: `--tag a` gives a string, but `--tag a --tag b` gives an array, and `-v -v -v` gives `[true,true,true]`.
- A Number hint turns bad or missing values into `NaN` silently (`--count abc` and a bare `--count`).
- A Path hint with a missing value throws `TypeError: Expected value of type union(string, Path), but received "<undefined>"`, which doesn't name the flag.
- Path hints are not normalized: `--p ../x` gives `/Users/suchipi/Code/yavascript/../x` (parse-script-args.ts:112-113, 121).
- A String hint with a missing value leaves the key present with value `undefined`, and an absent Boolean flag is `undefined` rather than `false`.

### F44. [rough-edge] env proxy edge cases

Verified:
- `env.hasOwnProperty("HOME")` throws `not a function`, and `String(env)` throws `failed to convert value to primitive`. `Object.hasOwn(env, ...)` works.
- Invalid names are silently no-ops: `env["A=B"] = "x"` and `env[""] = "x"`. A NUL in a value silently truncates it (`"a\0b"` becomes `"a"`).
- `Object.defineProperty(env, "X", ...)` doesn't set the real env var.
- Vars set through `require("quickjs:std").setenv` are readable via `env.X` but missing from `Object.keys(env)` and from child processes (`AUD_EXT=unset`), because `ownKeys` and the child env builder go through the proxy target (env.ts:35-37, ChildProcess.ts:110).

### F45. [question] Relative program paths resolve against the child's `cwd`

- `exec("./printargs.sh a", { cwd: "/usr" })` fails with ENOENT, while it works without `cwd`. This matches `(cd /usr && ./printargs.sh)`, so it's probably intended, but it's undocumented. Worth a sentence in the `cwd` docs.

## Verified working

- exec string, array, and Path forms. Array args with spaces, quotes, unicode, empty strings, `$HOME`, and newlines arrive verbatim (checked with printargs.sh). Numbers and Paths inside arrays are stringified.
- String parsing: whitespace splitting (space/tab/CR/LF/VT), quoted args, gluing adjacent quoted strings (`"a"'b'"c"` gives `abc`), `\n \r \t \v \\` inside quotes, a non-escape `\x` drops the backslash, trailing-backslash line continuations, and clear errors for unterminated quotes. Non-breaking space is not treated as a separator.
- `failOnNonZeroStatus`:
  - Default: throws `Command failed: ... (status = N, signal = undefined)` with `status`/`signal` props, plus `stdout`/`stderr` when captured.
  - `false`: returns `{ status, signal }`.
  - Signal deaths give `{ status: undefined, signal: 15/9/2 }`, and they throw by default.
- `captureOutput`:
  - `true`/`"utf8"` return strings. `"arraybuffer"` returns ArrayBuffers with exact bytes (`[255,254,0,65]`).
  - 10 MB of output is captured fully in both modes (tmpfile-based, no pipe deadlock).
  - UTF-8 multibyte is decoded, and invalid UTF-8 becomes U+FFFD.
- `block: false`: returns `{ wait }`, and `wait()` returns the documented shapes. Two concurrent non-blocking processes finish independently.
- `cwd` works as an absolute string, a relative string, or a Path; a non-string/Path value gives a clear TypeError.
- `env` option: number and boolean values are coerced, null/undefined values are dropped, and `{ ...env, X }` merges.
- Options type checks: `options` null, `failOnNonZeroStatus: "false"`, and bad `captureOutput` all give clear TypeErrors.
- Logging: `logging.info` and `logging.trace` are called as documented. The default `logger.info` prints `exec: ...` to stderr, and `logger.trace` defaults to a noop.
- `$` returns `{ stdout, stderr }` without trimming, matching the doc example (`"hi\n"`). All exec doc examples run as documented.
- `exec.toArgv` is exposed and matches exec's parsing.
- ChildProcess:
  - Defaults: `args`, `cwd` = pwd, env snapshot at construction, `std.in/out/err`, `UNSTARTED`, and `pid: null`.
  - `args`, `env`, and `cwd` can be mutated before `start()`.
  - `start()` returns the pid, and states move through UNSTARTED, STARTED, EXITED/SIGNALED with `oldPid`.
  - `waitUntilComplete()` before `start()` gives a clear error. It throws ECHILD (rather than hanging) if the child was already reaped elsewhere.
  - `stdio.in/out/err` accept FILE redirection, including out and err pointed at the same file with interleaving kept. A non-FILE stdio value gives a clear TypeError.
- glob:
  - Wildcards: `*`, `**`, `?`, `[tz]`, `[!tz]`, braces (including `{a/b,node_modules/pkg}`), and extglob `+()` / `@()`.
  - Dotfiles need an explicit leading dot (`.*`, `.hidden/*`), and `**` skips dot dirs.
  - `!` negation with AND semantics, partial-match pruning, and trailing `**` not matching its parent dir all work.
  - `followSymlinks: false` does not traverse symlinks (dead links are listed). `followSymlinks: true` goes through links; dead links warn and continue.
  - Unicode and space-containing names match. Patterns matching nothing give `[]`, and a nonexistent `dir` gives a clear error.
  - An absolute pattern without wildcards in its dir part infers the start dir. Results are Path objects, and `glob("")` throws `Invalid glob pattern`.
- env: reads, sets (numbers, booleans, objects, and arrays coerced to strings), `delete`, null/undefined assignment unsets, case-sensitive keys, `in`, `Object.keys`, spread, and JSON all work. Changes are visible to child processes.
- readEnvBool: `1/true/True/TRUE` give true and `0/false/False/FALSE` give false. Unset gives the fallback silently. `yes/no/on/off/tRuE/" true"/2/-1` warn and return the fallback. A `logging.warn` override is used, and a global `logger.warn` override is honored. With no `warn`, it stays silent.
- parseScriptArgs:
  - `--like-this`, `--like_this`, `--LIKE_THIS`, and `--fooBar` all become camelCase, and `-v` becomes `v`.
  - `--` ends flags (it is not included in `args`, and a second `--` is dropped).
  - `--foo=a=b` gives `a=b`, and `--foo=` gives `""`.
  - Hints work: String/Boolean/Number/Path and `types.arrayOf(...)`, including a Number hint accepting `-5`.
  - Repeated flags merge into arrays, `metadata.keys` is populated, and invalid `hints`/`args` give clear TypeErrors.
  - Unhinted values: `007`, `1e3`, and `0x10` stay strings.
  - With a plain script file, the default argv is `scriptArgs.slice(2)`, which is correct.
- openUrl (fake `open` on PATH): passes the URL/path verbatim as one argv entry (`https://example.com/?a=1&b=2`, `dir with space/prog`, `code.txt`) and returns `undefined`.

## Test coverage notes

- exec.test.ts has no tests for:
  - stdout ordering with redirected output (F1)
  - signal-killed processes
  - nonexistent program, bad `cwd`, or non-executable file (and their platform divergence, F6)
  - `wait()` called twice (F17)
  - `exec(Path)` with spaces (F7) and `exec([])`/`exec("")`
  - empty-string env propagation (F5)
  - `env` merge vs replace documented as a contract
  - stdin inheritance
  - large or binary output
  - `logging.info` override
- to-argv.test.ts misses: `\\` before a closing quote (F8), `"foo"bar` (F18), backslash-space outside quotes, `\0` in real argv, Path input, and the empty string.
- ChildProcess.test.ts covers only the happy path and state polling. Untested: `stdio` options, SIGNALED state, custom `env`/`cwd`, calling `start()` twice, `waitUntilComplete()` before `start()`, and invalid options.
- glob.test.ts (including the new `matcher.match` code path) has no tests for:
  - result ordering
  - `dir`/cwd with metacharacters (F9)
  - `../` patterns (F12)
  - trailing slash (F15)
  - backslash escapes (F13)
  - extglob `!(...)` (F14)
  - `glob([])` (F11)
  - relative `dir` (F26)
  - absolute literal or `?`/`[` patterns (F10)
  - symlink loops (F16)
  - unreadable subdirectories and the resulting exit-code abort (F2)
  - multiple absolute patterns with different roots
  - `logging.info`
- env.test.ts has no tests for empty-string values, `null`/`undefined` assignment, non-string coercion, or the `in` operator. readEnvBool coverage is good.
- parse-script-args.test.ts is a single snapshot with explicit args. Untested:
  - the default `scriptArgs.slice(2)` under `-e`/`--lang`/`-r` (F4)
  - negative numbers and `--x=-5` (F19)
  - `--no-*`, lone `-`, missing values, NaN, and Path normalization
- determine-target.test.ts has no case for `my-file -e ...` / `my-file --eval` (F3).
- openUrl has no functional test. It only appears in the globals listing (globals.test.ts:177, context.test.ts:177). A fake-`open`-on-PATH test like the one used here would cover argv, the non-blocking behavior, and error handling without opening a browser.
