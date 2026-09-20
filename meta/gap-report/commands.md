# Commands API audit

Scope: the command-shaped globals in `src/layer1/api/commands/` (basename, cat, cd, chmod, dirname, echo, exit, extname, ls, mkdir, mkdirp, printf, pwd, readlink, realpath, sleep, touch, which, whoami) and the "did you mean" stubs in `_stubs.ts`.

Binary tested: `dist/yavascript` (`--version` prints `git-3eedd831a85c`), macOS (Darwin 25), umask 022. All repro commands below are run from the repo root unless they start with a `cd`. Scratch fixtures and test scripts live in `.tmp/api-audit/commands-sandbox/` (the `t-*.js` files there are the full test scripts; the repros below are the minimal versions).

## Findings

### 1. bug - chmod: `"remove"` toggles bits instead of clearing them

- API: `chmod("remove", perms, path)`
- Removing a bit that is not set turns it ON. This can make a file world-writable while trying to remove write access.
- Repro:
  ```sh
  S=.tmp/api-audit/commands-sandbox/repro; touch $S/f
  chmod 644 $S/f; ./dist/yavascript -e 'chmod("remove", { user: "x" }, ".tmp/api-audit/commands-sandbox/repro/f"); (os.stat(".tmp/api-audit/commands-sandbox/repro/f").mode & 0o777).toString(8)'
  chmod 664 $S/f; ./dist/yavascript -e 'chmod("remove", { group: "w", others: "w" }, ".tmp/api-audit/commands-sandbox/repro/f"); (os.stat(".tmp/api-audit/commands-sandbox/repro/f").mode & 0o777).toString(8)'
  ```
- Expected: `644`, then `644` (what `chmod u-x` / `chmod go-w` give). Actual: `744` (user execute added), then `646` (others write added).
- Cause: [src/layer1/api/commands/chmod/chmod.ts:213-216](src/layer1/api/commands/chmod/chmod.ts) uses `perms ^= bitsToApply`; it should be `perms &= ~bitsToApply`.

### 2. bug - chmod: `"go"` targets user+group instead of group+others

- API: `chmod(op, { go: ... }, path)` (`Chmod.Who` `"go"`)
- Repro: `chmod 644 .tmp/api-audit/commands-sandbox/repro/f; ./dist/yavascript -e 'chmod("add", { go: "x" }, ".tmp/api-audit/commands-sandbox/repro/f"); (os.stat(".tmp/api-audit/commands-sandbox/repro/f").mode & 0o777).toString(8)'`
- Expected `655` (real `chmod go+x` gives 655, verified). Actual `754`: the user gets execute, others do not.
- Cause: [src/layer1/api/commands/chmod/chmod.ts:82-86](src/layer1/api/commands/chmod/chmod.ts) sets `user = true; group = true;` for `"go"`.

### 3. bug - chmod: string permissions accept garbage and silently apply a wrong mode (`"0o755"` becomes `000`)

- API: `chmod(permissions: string, path)`
- `parseInt(str, 8)` stops at the first non-octal character, so any string with a valid octal prefix is accepted and truncated.
- Repro: `chmod 644 .tmp/api-audit/commands-sandbox/repro/f; ./dist/yavascript -e 'chmod("0o755", ".tmp/api-audit/commands-sandbox/repro/f"); (os.stat(".tmp/api-audit/commands-sandbox/repro/f").mode & 0o777).toString(8)'`
- Expected: `755`, or an "Invalid permissions string" error. Actual: `0` (file becomes `---------`). Other observed results: `"789"` -> `0o007`, `"75x"` -> `0o075`, `" 755"` -> `0o755`. Only strings with no octal prefix (`"u+x"`, `"+x"`, `"rwxr-xr-x"`, `""`) get the error.
- `"0o755"` is the natural way for a JS author to write an octal string, so this is likely to happen in practice.
- Also a gap: symbolic modes (`"u+x"`, `"+x"`, `"go-w"`) aren't supported even though the docs say "Provides the same functionality as the unix binary". The error message says so clearly.
- Cause: [src/layer1/api/commands/chmod/chmod.ts:297-305](src/layer1/api/commands/chmod/chmod.ts). Validate with something like `/^[0-7]{1,4}$/` before parsing.

### 4. bug - dirname: a bare filename returns a Path that stringifies to `"/"`

- API: `dirname(path)`
- Repro: `./dist/yavascript -e 'String(dirname("a.txt"))'` then `./dist/yavascript -e 'ls(dirname("a.txt")).slice(0, 2).map(String)'`
- Expected: `.` (what coreutils `dirname a.txt` prints). Actual: `/`, and `ls(dirname("a.txt"))` lists the filesystem root (`["/home", "/usr"]`). The same happens for `dirname(".")`, `dirname("..")`, `dirname("")` and `dirname(new Path("a.txt"))`. `dirname("./a.txt")` correctly gives `.`.
- A script that does `ls(dirname(file))`, `cd(dirname(file))` or `writeFile(dirname(f) + "/out", ...)` with a bare filename ends up acting on `/`. Oddly, `new Path(dirname("a.txt"), "out.txt")` gives `out.txt`, so the empty Path behaves as "current dir" when joined and as "root" when stringified.
- The empty Path also inspects badly: `echo(dirname("a"))` prints `Path { segments: [] separator: "/" }` instead of the usual one-line form.
- Cause: [src/layer1/api/commands/dirname/dirname.ts:18](src/layer1/api/commands/dirname/dirname.ts) returns `pathObj.dirname()`, which is `replaceLast([])` in nice-path (`node_modules/nice-path/dist/index.js:277-279`). That produces an empty-segment Path, and `toString()` returns `"/"` for empty segments (`node_modules/nice-path/dist/index.js:234-238`).

### 5. bug - sleep: `sleep()` / `sleep(undefined)` / `sleep(NaN)` / `sleep("1s")` block forever

- API: `sleep`, `sleep.sync`
- Repro: `timeout 3 ./dist/yavascript -e 'sleep()'; echo rc=$?` and `timeout 3 ./dist/yavascript -e 'sleep("1s")'; echo rc=$?`
- Expected: a TypeError (or an immediate return). Actual: both hang until killed (`rc=124`). Same for `sleep(Infinity)` and `sleep("abc")`. `sleep(10n)` throws `TypeError: cannot convert bigint to number` from inside a-mimir's `sleepSync`.
- `sleep("1s")` is what a bash user will type. A missing or undefined variable passed to `sleep` hangs the script silently.
- The async form treats the same inputs differently: `sleep.async()`, `sleep.async(NaN)` and `sleep.async("abc")` resolve immediately (verified).
- Cause: [src/layer1/api/commands/sleep/sleep.ts:3-10](src/layer1/api/commands/sleep/sleep.ts) passes the argument straight to a-mimir, which calls `Atomics.wait(view, 0, 0, milliseconds)` (`node_modules/a-mimir/index.js:5`), and `NaN` there means "wait forever". There's no argument validation.

### 6. bug - ls: catching the error from an unreadable directory makes the process abort at exit (exit 134)

- API: `ls(dir)` (the root cause is in QuickJS `os.readdir`)
- Repro:
  ```sh
  S=.tmp/api-audit/commands-sandbox/repro; mkdir -p $S/locked; chmod 000 $S/locked
  ./dist/yavascript -e 'try { ls(".tmp/api-audit/commands-sandbox/repro/locked") } catch (e) { echo("caught:", e.message) }'; echo rc=$?
  chmod 755 $S/locked
  ```
- Expected: `caught: Permission denied ...`, `rc=0`. Actual: the message prints, then `Assertion failed: (list_empty(&rt->gc_obj_list)), function JS_FreeRuntime, file /opt/quickjs/src/quickjs/quickjs.c, line 2475.` and `rc=134` (SIGABRT). A script that handles the error correctly still exits as a failure.
- Isolated to native `os.readdir`: `try { os.readdir("missing-dir") } catch {}` also exits 134, and so does the EACCES case. Uncaught, it exits 1 normally. `ls` on a missing dir doesn't hit it because `isDir` short-circuits first. Any other API that catches `os.readdir` errors (glob, copy, ...) is probably affected too; I did not check those, since they're outside this area.
- Cause: leak in the `os.readdir` error path of the @suchipi/quickjs fork (stack trace points at `quickjs-os.c:701`). The C source is not in this repo, so I could not locate the exact line. `ls` calls it at [src/layer1/api/commands/ls/ls.ts:29-31](src/layer1/api/commands/ls/ls.ts).

### 7. bug - cat: pipes, FIFOs and `/dev/stdin` are truncated to whatever `stat` reported

- API: `cat(path)`
- Repro: `(sleep 0.3; printf 'late\n') | ./dist/yavascript -e 'JSON.stringify(cat("/dev/stdin"))'` and `(printf 'first\n'; sleep 0.5; printf 'second\n') | ./dist/yavascript -e 'JSON.stringify(cat("/dev/stdin"))'`
- Expected: `"late\n"` and `"first\nsecond\n"` (what `/bin/cat /dev/stdin` prints). Actual: `""` and `"first\n"`. It only seems to work when the producer has already written everything.
- Cause: [src/layer1/api/commands/cat/cat.ts:60-63](src/layer1/api/commands/cat/cat.ts) sizes the buffer from `os.stat(path).size` and does one `read` of that size. This is wrong for non-regular files. If `read` returns fewer bytes than `stat` promised, the leftover buffer (NUL bytes) is still returned, since `offset` is tracked but the buffer isn't shrunk. I inferred that from the code and did not reproduce it.
- Related gap: `cat("-")` throws `No such file or directory (errno = 2, path = -)`, and there is no documented high-level way to read stdin. The only route is the raw `std.in.readAsString()`.

### 8. bug - which: returns directories, and `which("")` returns the first PATH directory

- API: `which(binaryName)`
- Repro: `./dist/yavascript -e 'String(which(""))'` and `mkdir -p .tmp/api-audit/commands-sandbox/repro/bin/tool; ./dist/yavascript -e 'String(which("tool", { searchPaths: [".tmp/api-audit/commands-sandbox/repro/bin"] }))'`
- Expected: `null` both times (`/usr/bin/which` skips directories). Actual: `/Users/suchipi/Code/emsdk` (the first `PATH` entry) and `.tmp/api-audit/commands-sandbox/repro/bin/tool` (a directory). `which(".")` and `which("..")` also return `<dir>/.` and `<dir>/..`.
- Cause: [src/layer1/api/commands/which/which.ts:84](src/layer1/api/commands/which/which.ts) checks `exists && isExecutable`, and directories have the execute bit. It needs an `isFile` check (following symlinks), and `""` should be rejected.

### 9. bug - which: an empty PATH entry searches `/` instead of the current directory

- API: `which` default `searchPaths`
- Repro: `./dist/yavascript -e 'which("x", { searchPaths: [""], logging: { trace: console.log } })'`, or run with `PATH=":/some/dir"`
- Expected: POSIX treats an empty PATH entry (leading/trailing `:` or `::`) as the cwd; `/usr/bin/which localprog` with `PATH=":$PWD/bin2"` prints `./localprog`. Actual trace: `which: Checking for "/x"`, so it probes the filesystem root.
- Cause: [src/layer1/api/commands/which/which.ts:12](src/layer1/api/commands/which/which.ts) keeps `""` entries from `split`, and `new Path("", name)` at line 76 becomes `/name`.

### 10. gap - which: names containing a slash always return null

- API: `which(binaryName)`
- Repro: `./dist/yavascript -e 'String(which("/bin/ls"))'` and `/usr/bin/which /bin/ls`
- Expected: `/bin/ls`. Actual: `null`. The trace shows it checking `/usr/bin/bin/ls`. `which("./localprog")` and `which("bin1/prog")` also return `null`, where `/usr/bin/which` returns them. The docs don't say what happens with such names.
- Cause: [src/layer1/api/commands/which/which.ts:76](src/layer1/api/commands/which/which.ts) always joins `binaryName` onto each search path.

### 11. doc-mismatch - exit: setting `exit.code` in a Worker does not throw; it is silently ignored

- API: `exit.code`
- Doc ([exit.inc.d.ts:12-13](src/layer1/api/commands/exit/exit.inc.d.ts)): "Attempting to call `exit` or set `exit.code` within a Worker will fail and throw an error."
- Repro: `./dist/yavascript .tmp/api-audit/commands-sandbox/t-exit-worker.js; echo rc=$?` (the worker sets `exit.code = 3`, reads it back, then calls `exit(2)`)
- Actual: `"set exit.code ok"`, `"read exit.code: 0"`, `"exit(2) threw: cmdline.exit can only be called from the main thread"`, `rc=0`. Only the `exit()` half of the doc holds.

### 12. doc-mismatch - sleep.async can reject

- API: `sleep.async`
- Doc ([sleep.inc.d.ts:51-52](src/layer1/api/commands/sleep/sleep.inc.d.ts)): "The Promise returned by `sleep.async` will never get rejected."
- Repro: `./dist/yavascript -e 'sleep.async(10n).catch((e) => echo("rejected:", e.message))'`
- Actual: `rejected: cannot convert bigint to number`. An argument whose `valueOf` throws also rejects. This is minor on its own, but together with finding 5 it shows that no argument validation happens.

### 13. doc-mismatch - which: JSDoc documents a nonexistent `options.trace`

- API: `which`
- [which.inc.d.ts:10](src/layer1/api/commands/which/which.inc.d.ts) says `@param options.trace`, but the real option is `options.logging.trace`.
- Repro: `./dist/yavascript -e 'which("ls", { trace: (...a) => echo("TRACE", ...a) }) && echo("no trace output")'` prints `no trace output`, so `trace` is silently ignored.

### 14. doc-mismatch / question - chmod: `"set"` clears every class not mentioned, and none of the operations are explained

- API: `chmod("set", perms, path)`
- Repro: `chmod 655 .tmp/api-audit/commands-sandbox/repro/f; ./dist/yavascript -e 'chmod("set", { user: "rwx" }, ".tmp/api-audit/commands-sandbox/repro/f"); (os.stat(".tmp/api-audit/commands-sandbox/repro/f").mode & 0o777).toString(8)'`
- Actual: `700`. `chmod u=rwx` on the same file gives `755` (verified). `chmod("set", {}, f)` sets the mode to `000`. `"set"` also drops setuid/setgid/sticky (`0o4755` -> `0o755`).
- The docs list `"add" | "set" | "remove"` without saying what they do. Question: is "set replaces the whole mode" intended? If so, it needs documenting, because anyone coming from `u=rwx` will expect the other classes to be left alone.
- Cause: [src/layer1/api/commands/chmod/chmod.ts:38-40](src/layer1/api/commands/chmod/chmod.ts).

### 15. rough-edge - exit: invalid codes silently become a success exit

- API: `exit(code)`, `exit.code`
- Repro: `for c in 'exit(NaN)' 'exit("abc")' 'exit({})' 'exit.code = 5; exit(null)'; do ./dist/yavascript -e "$c"; echo "$c -> rc=$?"; done`
- Actual: all `rc=0`. Only `undefined` falls back to `exit.code`, so `exit(null)` throws away a previously set `exit.code = 5`. `exit.code = "abc"` reads back as `0`. `exit(2n)` gives rc=255. Bash rejects `exit abc` with "numeric argument required" and exit status 2.
- For comparison, `exit(256)` -> 0 and `exit(-1)` -> 255 match bash (`bash -c 'exit 256'` -> 0), so they're fine, but the doc could mention the 0-255 wraparound.
- Cause: [src/layer1/api/commands/exit/exit.ts:3-14](src/layer1/api/commands/exit/exit.ts) doesn't validate anything.

### 16. rough-edge - chmod: numeric permissions aren't range-checked

- API: `chmod(permissions: number, path)`
- Repro: `./dist/yavascript -e 'chmod(-1, ".tmp/api-audit/commands-sandbox/repro/f"); (os.stat(".tmp/api-audit/commands-sandbox/repro/f").mode & 0o7777).toString(8)'` -> `7777` (setuid, setgid and sticky all set). `chmod(755, f)` (decimal, an easy mistake) -> `1363` (sticky bit set, owner loses read). `chmod(1.5, f)` -> `001`.
- `chmod(NaN, f)` is rejected, but the message says "'permissions' argument must be either an octal string or a number", which is confusing since NaN is a number.
- Suggestion: require an integer in `0..0o7777`, and have the doc example use `0o755`.

### 17. doc-mismatch - mkdir/mkdirp: default stderr logging is undocumented, and what it logs is inconsistent

- API: `mkdir`, `mkdirp`, `options.logging`
- `mkdir.inc.d.ts` and `mkdirp.inc.d.ts` declare `logging.trace`/`logging.info` but say nothing about them. By default every `mkdir` prints a dimmed `mkdir: '<path>'` line to stderr through `logger.info`, which bash's `mkdir` never does. `logger.inc.d.ts` lists which/exec/copy/glob as users of `logger.info` but not mkdir.
- What gets logged depends on the path shape:
  ```sh
  cd .tmp/api-audit/commands-sandbox/repro && rm -rf lg && ../../../../dist/yavascript -e 'mkdirp("lg/a/b"); echo("--"); mkdirp("lg/c/d"); echo("--"); mkdirp(pwd().concat("lg/e/f").toString()); echo("--"); mkdir("lg/g")'
  ```
  Actual stderr is only `mkdir: 'lg'` and `mkdir: 'lg/g'`. `mkdirp("lg/a/b")` logs only the first segment (`lg`) rather than what it created. `mkdirp("lg/c/d")` (parent exists) logs nothing, and so does `mkdirp` with an absolute path. `mkdir("./rel/./x", { recursive: true })` also logs no info line.
- The default `mode` (`0o775`, before umask) isn't documented either.
- Cause: [src/layer1/api/commands/mkdir/mkdir.ts:76-83](src/layer1/api/commands/mkdir/mkdir.ts) treats `i === 0` as "the path the user asked for", but `i` indexes path segments, and segment 0 is `""` for absolute paths or `"."` for `./` paths, and those get skipped.

### 18. bug (error message) - mkdirp: a file as the first segment gives the wrong message

- API: `mkdirp` / `mkdir(..., { recursive: true })`
- Repro: `cd .tmp/api-audit/commands-sandbox/repro && touch f && ../../../../dist/yavascript -e 'mkdirp("f/sub")'`
- Expected: "...because 'f' is a file, not a directory." (the message you get when the file is deeper, e.g. `mkdirp("x/f/sub")`). Actual: `Cannot use mkdir to create directory 'f/sub' because there is an existing file with that name.`, which is false because `f/sub` doesn't exist.
- Cause: the same `i === 0` confusion, at [src/layer1/api/commands/mkdir/mkdir.ts:90-101](src/layer1/api/commands/mkdir/mkdir.ts). It should compare against the last segment.

### 19. doc-mismatch - mkdirp: `mode` is applied to intermediate directories, unlike `mkdir -p -m`

- API: `mkdirp(path, { mode })`
- Repro: `cd .tmp/api-audit/commands-sandbox && ../../../dist/yavascript -e 'mkdirp("m3/a", { mode: 0o700 })'` then `stat -f '%N %Lp' m3 m3/a` gives `700` / `700`. `mkdir -p -m 700 mkm/a/b` gives `mkm 755`, `mkm/a 755`, `mkm/a/b 700`.
- The doc says it "Provides the same functionality as `mkdir -p`." Either document the difference or apply the default mode to intermediates.
- Cause: [src/layer1/api/commands/mkdir/mkdir.ts:84](src/layer1/api/commands/mkdir/mkdir.ts).

### 20. rough-edge - mkdir(""): misleading error; mkdirp(""): silent success

- Repro: `./dist/yavascript -e 'mkdir("")'` -> `Cannot use mkdir to create root dir '/'. Maybe you wanted to pass '{ recursive: true }'?`. And `./dist/yavascript -e 'mkdirp(""); echo("ok")'` -> `ok`.
- Bash: `mkdir ""` and `mkdir -p ""` both fail with "No such file or directory". The `mkdir` error comes from the same empty-Path-is-`/` behavior as finding 4, and the hint to pass `{ recursive: true }` then turns it into a silent no-op.

### 21. rough-edge - cd: `env.PWD` / `env.OLDPWD` are not updated, so child processes inherit a stale `$PWD`

- API: `cd`
- Repro: `cd .tmp/api-audit/commands-sandbox/repro && ../../../../dist/yavascript -e 'cd("../fx"); exec(["printenv", "PWD"])'`
- Expected: `.../commands-sandbox/fx` (bash's `cd` exports the new `PWD` and sets `OLDPWD`). Actual: `.../commands-sandbox/repro`. Also `env.PWD` inside the script is unchanged after `cd`. Child processes that trust `$PWD` see the wrong directory.
- Related bash-isms that don't exist: `cd("-")` throws `No such file or directory (errno = 2, target = -)`, and `cd("~")` / `cd("~/x")` throw (see finding 29). Extra arguments are silently ignored (`cd("fx", "extra")` just goes to `fx`).
- Cause: [src/layer1/api/commands/cd/cd.ts:31](src/layer1/api/commands/cd/cd.ts) only calls `os.chdir`.

### 22. question - pwd and ls resolve symlinks (physical paths), unlike bash's logical `pwd`

- APIs: `pwd`, `ls`
- Repro: `cd .tmp/api-audit/commands-sandbox/fx/link-to-dir1 && pwd && ../../../../../dist/yavascript -e 'pwd()'` -> bash prints `.../fx/link-to-dir1`, yavascript prints `Path { .../fx/dir1 }`.
- `ls` returns children under the realpath of the directory: `./dist/yavascript -e 'String(ls("/tmp")[0])'` -> `/private/tmp/...` on macOS, and `ls("link-to-dir1")` returns `.../fx/dir1/...`. The `ls` doc only says "as absolute paths", so the symlink resolution is undocumented. Scripts that compare `ls(x)` results against paths built from `x` will not match.
- Cause: [src/layer1/api/commands/ls/ls.ts:27](src/layer1/api/commands/ls/ls.ts) (`os.realpath(dir)`); `pwd` uses `os.getcwd()`.

### 23. rough-edge - ls: says "Not a directory" for missing paths, throws on files, and doesn't sort

- API: `ls`
- Repro (in `.tmp/api-audit/commands-sandbox/fx`): `ls("nope")` -> `Error: Not a directory: nope`. `ls("dead-link")` and `ls("")` give the same. `ls("a.txt")` also throws `Not a directory: a.txt`, where `/bin/ls a.txt` prints the file.
- Order is raw `readdir` order (`.hidden`, `sp ace dir`, `ünïcødé`, `b.txt`, `a.txt`, ...), where `/bin/ls` sorts. Hidden files are included, which is implied by "`.` and `..` are omitted" but worth saying outright.
- Cause: [src/layer1/api/commands/ls/ls.ts:23-25](src/layer1/api/commands/ls/ls.ts) turns every `isDir` false into "Not a directory".

### 24. doc-mismatch - basename/dirname: differ from the coreutils binaries they claim to match

- APIs: `basename`, `dirname` (both docs: "Provides the same functionality as the unix binary of the same name")
- Repro: `./dist/yavascript -e 'JSON.stringify([basename("/"), basename("/tmp/foo\\bar.txt"), String(dirname("/tmp/foo\\bar.txt"))])'`
- Actual: `["", "bar.txt", "/tmp/foo"]`. coreutils: `basename /` -> `/`, `basename '/tmp/foo\bar.txt'` -> `foo\bar.txt`, `dirname` -> `/tmp`. Backslash is a legal filename character on POSIX, but Path splitting treats it as a separator even in a `/`-separated path.
- The dirname doc example says it returns the string `"/home/suchipi"`, but the signature and the actual return value are a `Path` ([dirname.inc.d.ts:6-7](src/layer1/api/commands/dirname/dirname.inc.d.ts)).
- Question: the backslash handling is probably intentional for cross-platform input. If so, document it, and drop the "same as the unix binary" claim.

### 25. question - extname: dotfiles and `.`/`..` treated as extensions; options validated only sometimes

- API: `extname`
- Repro: `./dist/yavascript -e 'JSON.stringify([".bashrc", ".", "..", "..foo", "file."].map(x => extname(x)))'` -> `[".bashrc", ".", ".", ".foo", "."]`. Node's `path.extname` gives `["", "", "", ".foo", "."]`. The doc says files without an extension return `''`, and most people would say `.bashrc` has no extension.
- `extname("foo", "bad")` returns `""`, while `extname("foo.txt", "bad")` throws `'options' argument must be either an object or undefined`, because options are validated after the early return at [src/layer1/api/commands/extname/extname.ts:24-32](src/layer1/api/commands/extname/extname.ts).

### 26. rough-edge - readlink: normalizes the link target and gives errors without a path

- API: `readlink`
- Repro: `cd .tmp/api-audit/commands-sandbox/lk && ../../../../dist/yavascript -e 'for (const l of ["l1","l2"]) echo(l, JSON.stringify(String(readlink(l))), JSON.stringify(os.readlink(l)))'` (the links point at `dir1/` and `a//b`)
- Actual: `l1 "dir1" "dir1/"` and `l2 "a/b" "a//b"`. The doc says it "Returns the target of the symlink", but the trailing slash, which changes meaning (it forces a directory), is dropped. Wrapping the result in a Path is why.
- Errors: `readlink("a.txt")` (not a link) -> `Error: Invalid argument (errno = 22)`. `readlink("nope")` -> `No such file or directory (errno = 2)`. Neither includes the path, while `realpath`, `cd` and `cat` errors do. A "not a symbolic link" message would help.
- Cause: [src/layer1/api/commands/readlink/readlink.ts:23](src/layer1/api/commands/readlink/readlink.ts).

### 27. doc-mismatch - printf: "the same formats as the standard C library printf" is not true

- API: `printf`
- Repro: `./dist/yavascript .tmp/api-audit/commands-sandbox/t-printf.js`
- Rejected with `TypeError: invalid conversion specifier in format string`: `%lld`, `%hd`, `%zu`, `%j`, `%p`, `%n`, `%q`, positional `%1$s`, and a trailing lone `%` (`"100%"`). `%lld` stands out because the doc points people at length modifiers.
- Other behavior worth documenting: `%s` with an object prints `[object Object]` (unlike `echo`, which inspects). `%d` with `"abc"` prints `0` silently. `%d`/`%ld` accept BigInt but `%f` with BigInt throws `cannot convert bigint to number`. A missing argument throws `ReferenceError: missing argument for conversion specifier`. Extra arguments are ignored.

### 28. rough-edge - inconsistencies between sibling commands

- Path arguments: every path-taking command accepts a `Path` except `which`: `./dist/yavascript -e 'which(new Path("ls"))'` -> `TypeError: 'binaryName' must be a string`.
- Multiple paths: `cat` takes an array. `touch(["a","b"])` throws, and `touch("c.txt", "d.txt")` silently creates only `c.txt` (verified in `t-touch.js`). Bash's `touch`, `mkdir` and `chmod` all take several paths.
- Return types: `basename` and `extname` return strings, while `dirname`, `readlink`, `realpath`, `pwd`, `ls` and `which` return `Path`.
- Error style: `mkdir` throws descriptive errors with `path`/`parentPath` properties. `ls` says "Not a directory" for everything. `cat("dir1")` -> `Is a directory (errno = 21)` with no path. `chmod(0o755, "missing")` -> `No such file or directory (errno = 2)` with no path, while the object form includes `path = ...`.
- Declarations: `sleep` is `declare var` while the other commands are `declare const` ([sleep.inc.d.ts:15](src/layer1/api/commands/sleep/sleep.inc.d.ts)). TypeScript users can therefore reassign `sleep` but not the others.

### 29. rough-edge - no `~` expansion anywhere

- APIs: `cd`, `cat`, `ls`, `mkdir`, `touch`, `realpath`
- Repro: `./dist/yavascript -e 'cd("~")'` -> `No such file or directory (errno = 2, target = ~)`. `ls("~")` -> `Not a directory: ~`. `mkdir("~/x")` -> "its parent '~' does not exist". `mkdir("~/x", { recursive: true })` creates a literal `./~/x` (verified in the sandbox: `exists("~")` -> `true` and `ls -la` shows a `~` directory). `touch("~/x")` -> ENOENT.
- Grepping `src/layer1` for `"~"`/`homedir` finds no expansion helper. Only `cd()` with no argument uses `env.HOME`. Bash users will expect `~` to work, so either document that it's literal or provide a helper.

### 30. doc-mismatch (wording) - touch says it updates "creation" time

- [touch.inc.d.ts:2](src/layer1/api/commands/touch/touch.inc.d.ts): "update its creation/modification timestamps". It actually sets access and modification time to now ([touch.ts:35](src/layer1/api/commands/touch/touch.ts), `os.utimes`); `t-touch.js` shows both atime and mtime updated. Birth time can't be set this way.
- Undocumented behavior, which matches bash: `touch` on a dangling symlink creates the link's target. `touch("newdir/")` -> `No such file or directory (errno = 2, filename = newdir/, mode = w)`.

### 31. question - the stubs make `typeof cp` throw and `"cp" in globalThis` true

- API: `_stubs.ts` (cp, mv, ren, rm, grep, man, cwd, where, id, openURL, ensureDir)
- Repro: `./dist/yavascript -e 'echo("cp" in globalThis); try { typeof cp } catch (e) { echo("typeof threw:", e.message) }'` (from `t-stubs.js`: `'cp' in globalThis: true`, `typeof cp` -> throws `'cp' is not defined. Did you mean 'copy'?`)
- A truly undefined global gives `typeof x === "undefined"` without throwing. Feature detection like `typeof id === "undefined"` or `"id" in globalThis` breaks, and `id`/`where`/`man` are common names. Declaring them with `let`/`var`/`function` works fine (verified `let cp = 5`, `function rm() {}`, `var rm = ...`). Each stub's suggestion does exist (all of `copy`, `rename`, `remove`, `grepFile`, `grepString`, `grepArray`, `"".grep`, `[].grep`, `help`, `pwd`, `which`, `whoami`, `openUrl`, `mkdirp` are functions).
- Possible additions for 1.0: `rmdir` -> `remove`, `ln` -> `os.symlink`, `head`/`tail` -> `readFile(...).split("\n")`, `mktemp`.

### 32. gap - whoami drops useful passwd fields

- `./dist/yavascript -e 'std.getpwuid(std.geteuid())'` returns `name, passwd, uid, gid, gecos, dir, shell`, but `whoami()` returns only `{ name, uid, gid }` ([whoami.ts:12-16](src/layer1/api/commands/whoami/whoami.ts)). The home directory and shell are handy for scripts. The doc says "similar to `whoami` and `id`", but there's no group name and no supplementary groups (`id -gn` -> `staff`, `id -G` lists 17 groups).
- Question: `gid` is the passwd primary gid, not `getegid()`. They matched in my environment (`20`/`20`), so I couldn't show a divergence, but the doc doesn't say which one it is.

### 33. gap - commands a 1.0 bash replacement might be expected to have

I checked each against the top-level declarations in [yavascript.d.ts](yavascript.d.ts) (`grep '^declare (function|const|var)'`) and by probing `typeof globalThis[name]` (`t-stubs.js`):

| Missing | Closest existing thing |
| --- | --- |
| reading stdin (`cat -`, `read`) | raw `std.in.readAsString()` only |
| `ln` / symlink | raw `os.symlink` only |
| `head` / `tail` / `wc` | `readFile(p).split("\n")` by hand |
| `tee` | none |
| `mktemp` (file or dir) | `std.tmpfile()` (anonymous file only, no path, no dir) |
| `chown` | none (no `os.chown` either) |
| `stat` / file size / mtime | raw `os.stat` only |
| `du` | none |
| `rmdir` | `remove` (recursive) |
| `find` | `glob` covers most uses |
| `date` | JS `Date` |
| `hostname` | none |

## Verified working

- `basename`: normal and trailing-slash paths (`/a/b/` -> `b`, matches coreutils), unicode, spaces, `Path` input, Windows-style paths. Wrong types give a clear TypeError.
- `dirname`: absolute, nested, `./x`, `~/foo` (literal), trailing slash, Path input. Returns a `Path`.
- `extname`: `.js`, compound `.test.js` with `{ full: true }`, `Makefile` -> `''`, Windows paths, `Path.prototype.extname`. Clear TypeErrors.
- `cat`: single file, `Path`, arrays mixing strings and Paths, `[]` (-> `""` / empty ArrayBuffer), symlink to file, unicode names and content, invalid UTF-8 (decoded with U+FFFD), `{ binary: true }` exact bytes, `/dev/null`, `/dev/fd/3`. Errors for missing files, dangling links (includes `linkpath`), dirs, `file/` and bad `options` types.
- `cd`: relative, absolute, `/`, trailing slash, unicode, spaces, `Path`, symlinked dir. No argument, `undefined` or `null` go to `$HOME`. With `HOME` unset or empty you get a clear error. Clear errors for missing paths, files, dangling links and wrong types. `exec` children run in the new cwd.
- `pwd` / `pwd.initial`: returns a `Path`. `pwd.initial` is frozen and holds the startup cwd even when `cd` runs before `pwd` is first touched, in both `-e` and script modes. After the cwd is deleted, `pwd()` throws ENOENT.
- `chmod`: octal numbers, octal strings (`"755"`, `"0755"`, `"4755"`), `Path` input. Object form: every documented Who except `go`, every documented Permission, `add`/`set`, multiple keys. Clear errors for a bad operation, bad Who, bad Permission, wrong arity and swapped args.
- `echo`: no args (blank line), multiple args, objects, Paths, BigInt, Symbol. Output matches `console.log`.
- `printf`: `%s %d %i %f %x %X %o %c %e %g %a %%`, flags `- 0 + space`, `*` width, precision, `%ld` 64-bit, BigInt with `%d`/`%ld`, unicode (byte-width padding, like C). No trailing newline. A non-string format gives a clear TypeError.
- `exit`: `exit(n)`, `exit()` uses `exit.code`, `exit.code` used on normal exit, exit from `setTimeout`, `.then`, and async functions after `await` (pending timers and intervals don't run), stdout flushed on exit (including partial lines). `exit` is immediate (a `finally` block doesn't run, like `process.exit`). An uncaught error exits 1 regardless of `exit.code`. `exit()` in a Worker throws.
- `ls`: no args, `.`, relative, trailing slash, `Path`, empty dir, unicode, spaces, hidden files included. Results are absolute `Path`s and JSON-serialize to strings.
- `mkdir`/`mkdirp`: relative/absolute, nested with and without `recursive`, existing-dir error vs. recursive no-op, file-collision and parent-is-file errors (when not the first segment), symlink-to-dir handled as a dir, `..`/`.` segments, `mode` honored (after umask), custom `logging` hooks, option type validation. A dangling symlink gives a raw EEXIST, as bash does.
- `readlink`: relative and absolute targets, dangling links, `Path` input. Returns a `Path`.
- `realpath`: `.`, `..`, symlinks to files and dirs, `dir/../x`, unicode, `/tmp` -> `/private/tmp`, `Path` input. ENOENT with the path for dangling links, missing paths and `""`.
- `sleep`: `sleep(100)` / `sleep.sync(100)` block for at least 100 ms (timers don't run during them). `sleep.async(100)` resolves to `undefined` after at least 100 ms, and timers do run meanwhile. Negative or zero values return immediately.
- `touch`: creates an empty file (`0o644` with umask 022), updates atime/mtime on existing files without truncating, works on dirs, symlinks (updates the target), read-only files you own, unicode and spaces, `Path` input. Clear TypeError for bad input.
- `which`: PATH order, skips non-executable files and dangling symlinks, finds symlinked binaries, dirs with spaces, `searchPaths` (strings and Paths, overriding PATH), `suffixes`, `logging.trace`, unset or empty `PATH` -> `null`. Option types validated clearly.
- `whoami`: `name`/`uid`/`gid` match `whoami`, `id -u` and `id -g`.
- Stubs: all 11 throw the documented "did you mean" ReferenceError on access, and each suggested replacement exists. User code can override them with assignment, `var`, `let` or `function`.

## Test coverage notes

Tests are in [meta/tests/src/](meta/tests/src/). Important untested behavior:

- `chmod`: no tests at all. Findings 1, 2, 3, 14 and 16 would all have been caught by basic tests of the object form and string parsing.
- `touch`: no tests at all (create vs. update, mtime change, content preserved).
- `dirname`: only absolute paths are tested. Add `dirname("a.txt")`, `dirname(".")`, `dirname("/")`, `dirname("")` (finding 4).
- `basename`: no root, empty or trailing-slash cases.
- `extname`: no dotfile, `.`/`..`, or `file.` cases.
- `cat`: no error cases (missing file, dir, dangling link), no `Path` input, no empty array, no symlink, no pipe/FIFO (finding 7).
- `ls`: no tests for a symlinked dir or realpath behavior, a file argument, a missing dir, an unreadable dir (finding 6), or ordering. The existing tests `.sort()` before comparing, which hides the missing sort.
- `mkdir`: good error-path coverage, but no tests for `mode`, symlinked dirs, dangling symlinks, the info-log content for absolute or partially existing recursive paths (finding 17), or a file as the first segment (finding 18).
- `which`: no tests for directories on PATH (finding 8), `""`, names with slashes (finding 10), empty PATH entries (finding 9), relative search paths, or non-executable files shadowed by later executable ones.
- `sleep`: no invalid-argument tests (finding 5) and no assertion that it actually waited.
- `exit`: no tests for out-of-range or invalid values, exit from a timer/promise/async function, or `exit.code` in a Worker (finding 11). [worker.test.ts](meta/tests/src/worker.test.ts) covers only `exit()` in a Worker.
- `cd`/`pwd`: no tests for `cd()` -> HOME, missing HOME, error messages, symlinked dirs (logical vs physical), or `env.PWD` (finding 21). The `pwd.initial` test calls `pwd()` before `cd`, so it can't catch a lazily captured initial value. Manually, I found the value is captured correctly anyway.
- `printf`: one happy-path test. Nothing for BigInt, `%ld`, unsupported specifiers or a missing argument.
- `readlink`: no tests for non-link or missing paths, or for trailing-slash targets (finding 26).
- `whoami`: only checks shape and types.
- Stubs: [globals.test.ts](meta/tests/src/globals.test.ts) only snapshots "get throws error" and never checks the message text or the `typeof` behavior.
