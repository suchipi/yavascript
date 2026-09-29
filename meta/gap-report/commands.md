# Commands API audit

Scope: the command-shaped globals in `src/layer1/api/commands/` (basename, cat, cd, chmod, dirname, echo, exit, extname, ls, mkdir, mkdirp, printf, pwd, readlink, realpath, sleep, touch, which, whoami) and the "did you mean" stubs in `_stubs.ts`.

Binary tested: `dist/yavascript` (`--version` prints `git-d8cc554c0810`), macOS (Darwin 25), umask 022. All repro commands below are run from the repo root unless they start with a `cd`. Scratch fixtures live in `.tmp/gap-update/commands/` (`repro/`, `fx/` and `lk/`).

## Findings

### 1. bug - mkdir: a bare relative name throws `ZeroSegmentsError`

- API: `mkdir(path)`
- Repro: `cd .tmp/gap-update/commands && ../../../dist/yavascript -e 'mkdir("newdir")'`
- Expected: creates `./newdir`, like `mkdir newdir`.
- Actual: `PathErrors.ZeroSegmentsError: 'replaceLast' is attempting to create a Path with zero segments, which is invalid`. `mkdir("./newdir")` and `mkdirp("newdir")` work.
- Cause: [src/layer1/api/commands/mkdir/mkdir.ts:116](src/layer1/api/commands/mkdir/mkdir.ts) calls `dirname(path)` to check the parent, and `dirname` of a one-segment path throws.

### 2. gap - chmod: symbolic modes aren't supported

- API: `chmod(permissions: string, path)`
- Repro: `./dist/yavascript -e 'chmod("u+x", ".tmp/gap-update/commands/repro/f")'`
- Actual: `Error: Invalid permissions string: u+x. It should be an octal-representation number, like "750".` The same happens for `"+x"`, `"go-w"` and `"rwxr-xr-x"`. The docs say "Provides the same functionality as the unix binary of the same name", but only 1-4 octal digits are accepted. The error message says so clearly, and the object form (`chmod("add", { user: "x" }, path)`) is the only symbolic route.
- Cause: [src/layer1/api/commands/chmod/chmod.ts:297-303](src/layer1/api/commands/chmod/chmod.ts) accepts only `/^[0-7]{1,4}$/`.

### 3. gap - cat: `cat("-")` doesn't read stdin, and there's no documented way to read stdin

- API: `cat(path)`
- Repro: `echo hi | ./dist/yavascript -e 'cat("-")'`
- Expected: `hi` (what `/bin/cat -` prints). Actual: `Error: No such file or directory (errno = 2, filename = -, mode = rb)`.
- `cat("/dev/stdin")` reads piped input in full, but that's undocumented and depends on the platform having `/dev/stdin`. The only other route is the raw `std.in.readAsString()`.
- Cause: [src/layer1/api/commands/cat/cat.ts:59](src/layer1/api/commands/cat/cat.ts) passes every path straight to `readWholeFile`, which `std.open`s it.

### 4. gap - which: names containing a slash always return null

- API: `which(binaryName)`
- Repro: `./dist/yavascript -e 'String(which("/bin/ls"))'` and `/usr/bin/which /bin/ls`
- Expected: `/bin/ls`. Actual: `null`. The trace shows it checking `/usr/bin/bin/ls`. `which("./localprog")` and `which("bin2/localprog")` also return `null`, where `/usr/bin/which` returns them. The docs don't say what happens with such names.
- Cause: [src/layer1/api/commands/which/which.ts:79](src/layer1/api/commands/which/which.ts) always joins `binaryName` onto each search path.

### 5. doc-mismatch - exit: setting `exit.code` in a Worker does not throw; it is silently ignored

- API: `exit.code`
- Doc ([exit.inc.d.ts:12-13](src/layer1/api/commands/exit/exit.inc.d.ts)): "Attempting to call `exit` or set `exit.code` within a Worker will fail and throw an error."
- Repro:
  ```sh
  cd .tmp/gap-update/commands
  printf '%s\n' 'Worker.parent.onmessage = () => { exit.code = 3; echo("set exit.code ok"); echo("read exit.code:", exit.code); try { exit(2) } catch (e) { echo("exit(2) threw:", e.message) } Worker.parent.onmessage = null; };' > w.js
  ../../../dist/yavascript -e 'const w = new Worker("./w.js"); setTimeout(() => w.postMessage("go"), 10); void 0'; echo rc=$?
  ```
- Actual: `set exit.code ok`, `read exit.code: 0`, `exit(2) threw: cmdline.exit can only be called from the main thread`, `rc=0`. Only the `exit()` half of the doc holds.

### 6. doc-mismatch - which: JSDoc documents a nonexistent `options.trace`

- API: `which`
- [which.inc.d.ts:10](src/layer1/api/commands/which/which.inc.d.ts) says `@param options.trace`, but the real option is `options.logging.trace`.
- Repro: `./dist/yavascript -e 'which("ls", { trace: (...a) => echo("TRACE", ...a) }) && echo("no trace output")'` prints `no trace output`, so `trace` is silently ignored.

### 7. doc-mismatch / question - chmod: `"set"` clears every class not mentioned, and none of the operations are explained

- API: `chmod("set", perms, path)`
- Repro: `chmod 655 .tmp/gap-update/commands/repro/f; ./dist/yavascript -e 'chmod("set", { user: "rwx" }, ".tmp/gap-update/commands/repro/f"); (os.stat(".tmp/gap-update/commands/repro/f").mode & 0o777).toString(8)'`
- Actual: `700`. `chmod u=rwx` on the same file gives `755` (verified). `chmod("set", {}, f)` sets the mode to `000`. `"set"` also drops setuid/setgid/sticky (`0o4755` -> `0o755`).
- The docs list `"add" | "set" | "remove"` without saying what they do. Question: is "set replaces the whole mode" intended? If so, it needs documenting, because anyone coming from `u=rwx` will expect the other classes to be left alone.
- Cause: [src/layer1/api/commands/chmod/chmod.ts:38-40](src/layer1/api/commands/chmod/chmod.ts).

### 8. rough-edge - exit: invalid codes silently become a success exit

- API: `exit(code)`, `exit.code`
- Repro: `for c in 'exit(NaN)' 'exit("abc")' 'exit({})' 'exit.code = 5; exit(null)'; do ./dist/yavascript -e "$c"; echo "$c -> rc=$?"; done`
- Actual: all `rc=0`. Only `undefined` falls back to `exit.code`, so `exit(null)` throws away a previously set `exit.code = 5`. `exit.code = "abc"` reads back as `0`. `exit(2n)` gives rc=255. Bash rejects `exit abc` with "numeric argument required" and exit status 2.
- For comparison, `exit(256)` -> 0 and `exit(-1)` -> 255 match bash (`bash -c 'exit 256'` -> 0), so they're fine, but the doc could mention the 0-255 wraparound.
- Cause: [src/layer1/api/commands/exit/exit.ts:3-14](src/layer1/api/commands/exit/exit.ts) doesn't validate anything.

### 9. rough-edge - chmod: numeric permissions aren't range-checked

- API: `chmod(permissions: number, path)`
- Repro: `./dist/yavascript -e 'chmod(-1, ".tmp/gap-update/commands/repro/f"); (os.stat(".tmp/gap-update/commands/repro/f").mode & 0o7777).toString(8)'` -> `7777` (setuid, setgid and sticky all set). `chmod(755, f)` (decimal, an easy mistake) -> `1363` (sticky bit set, owner loses read). `chmod(1.5, f)` -> `001`.
- `chmod(NaN, f)` is rejected, but the message says "'permissions' argument must be either an octal string or a number", which is confusing since NaN is a number.
- Suggestion: require an integer in `0..0o7777`, and have the doc example use `0o755`.

### 10. doc-mismatch - mkdir/mkdirp: default stderr logging is undocumented, and what it logs is inconsistent

- API: `mkdir`, `mkdirp`, `options.logging`
- `mkdir.inc.d.ts` and `mkdirp.inc.d.ts` declare `logging.trace`/`logging.info` but say nothing about them. By default every `mkdir` prints a dimmed `mkdir: '<path>'` line to stderr through `logger.info`, which bash's `mkdir` never does. `logger.inc.d.ts` lists which/exec/copy/glob as users of `logger.info` but not mkdir.
- What gets logged depends on the path shape:
  ```sh
  cd .tmp/gap-update/commands/repro && rm -rf lg && ../../../../dist/yavascript -e 'mkdirp("lg/a/b"); echo("--"); mkdirp("lg/c/d"); echo("--"); mkdirp(pwd().concat("lg/e/f").toString()); echo("--"); mkdir("lg/g")'
  ```
  Actual stderr is only `mkdir: 'lg'` and `mkdir: 'lg/g'`. `mkdirp("lg/a/b")` logs only the first segment (`lg`) rather than what it created. `mkdirp("lg/c/d")` (parent exists) logs nothing, and so does `mkdirp` with an absolute path. `mkdir("./rel/./x", { recursive: true })` also logs no info line.
- The default `mode` (`0o775`, before umask) isn't documented either.
- Cause: [src/layer1/api/commands/mkdir/mkdir.ts:77-84](src/layer1/api/commands/mkdir/mkdir.ts) treats `i === 0` as "the path the user asked for", but `i` indexes path segments, and segment 0 is `""` for absolute paths or `"."` for `./` paths, and those get skipped.

### 11. doc-mismatch - mkdirp: `mode` is applied to intermediate directories, unlike `mkdir -p -m`

- API: `mkdirp(path, { mode })`
- Repro: `cd .tmp/gap-update/commands && ../../../dist/yavascript -e 'mkdirp("m3/a", { mode: 0o700 })'` then `stat -f '%N %Lp' m3 m3/a` gives `700` / `700`. `mkdir -p -m 700 mkm/a/b` gives `mkm 755`, `mkm/a 755`, `mkm/a/b 700`.
- The doc says it "Provides the same functionality as `mkdir -p`." Either document the difference or apply the default mode to intermediates.
- Cause: [src/layer1/api/commands/mkdir/mkdir.ts:85](src/layer1/api/commands/mkdir/mkdir.ts).

### 12. rough-edge - cd: `env.PWD` / `env.OLDPWD` are not updated, so child processes inherit a stale `$PWD`

- API: `cd`
- Repro: `cd .tmp/gap-update/commands/repro && ../../../../dist/yavascript -e 'cd("../fx"); exec(["printenv", "PWD"])'`
- Expected: `.../commands/fx` (bash's `cd` exports the new `PWD` and sets `OLDPWD`). Actual: `.../commands/repro`. Also `env.PWD` inside the script is unchanged after `cd`. Child processes that trust `$PWD` see the wrong directory.
- Related bash-isms that don't exist: `cd("-")` throws `No such file or directory (errno = 2, target = -)`, and `cd("~")` / `cd("~/x")` throw (see finding 20). Extra arguments are silently ignored (`cd("fx", "extra")` just goes to `fx`).
- Also: with `HOME` set to an empty string, `cd()` fails with `No such file or directory (errno = 2, target = )`. With `HOME` unset it gives the clear "Please either specify a path ... or set the HOME environment variable" message. [cd.ts:13](src/layer1/api/commands/cd/cd.ts) only checks `path == null`.
- Cause: [src/layer1/api/commands/cd/cd.ts:31](src/layer1/api/commands/cd/cd.ts) only calls `os.chdir`.

### 13. question - pwd and ls resolve symlinks (physical paths), unlike bash's logical `pwd`

- APIs: `pwd`, `ls`
- Repro: `cd .tmp/gap-update/commands/fx/link-to-dir1 && pwd && ../../../../../dist/yavascript -e 'pwd()'` -> bash prints `.../fx/link-to-dir1`, yavascript prints `Path { .../fx/dir1 }`.
- `ls` returns children under the realpath of the directory: `./dist/yavascript -e 'String(ls("/tmp")[0])'` -> `/private/tmp/...` on macOS, and `ls("link-to-dir1")` returns `.../fx/dir1/...`. The `ls` doc only says "sorted, as absolute paths", so the symlink resolution is undocumented. Scripts that compare `ls(x)` results against paths built from `x` will not match.
- Cause: [src/layer1/api/commands/ls/ls.ts:27](src/layer1/api/commands/ls/ls.ts) (`os.realpath(dir)`); `pwd` uses `os.getcwd()`.

### 14. rough-edge - ls: says "Not a directory" for missing paths, and throws on files

- API: `ls`
- Repro (in `.tmp/gap-update/commands/fx`): `ls("nope")` -> `Error: Not a directory: nope`. `ls("dead-link")` and `ls("")` give the same. `ls("a.txt")` also throws `Not a directory: a.txt`, where `/bin/ls a.txt` prints the file.
- Hidden files are included, which is implied by "`.` and `..` are omitted" but worth saying outright.
- Cause: [src/layer1/api/commands/ls/ls.ts:23-25](src/layer1/api/commands/ls/ls.ts) turns every `isDir` false into "Not a directory".

### 15. doc-mismatch - basename/dirname: differ from the coreutils binaries they claim to match

- APIs: `basename`, `dirname` (both docs: "Provides the same functionality as the unix binary of the same name")
- Repro: `./dist/yavascript -e 'JSON.stringify([basename("/"), basename("/tmp/foo\\bar.txt"), String(dirname("/tmp/foo\\bar.txt"))])'`
- Actual: `["", "bar.txt", "/tmp/foo"]`. coreutils: `basename /` -> `/`, `basename '/tmp/foo\bar.txt'` -> `foo\bar.txt`, `dirname` -> `/tmp`. Backslash is a legal filename character on POSIX, but Path splitting treats it as a separator even in a `/`-separated path.
- The dirname doc example says it returns the string `"/home/suchipi"`, but the signature and the actual return value are a `Path` ([dirname.inc.d.ts:6-7](src/layer1/api/commands/dirname/dirname.inc.d.ts)).
- Question: the backslash handling is probably intentional for cross-platform input. If so, document it, and drop the "same as the unix binary" claim.

### 16. question - extname: dotfiles and `.`/`..` treated as extensions; options validated only sometimes

- API: `extname`
- Repro: `./dist/yavascript -e 'JSON.stringify([".bashrc", ".", "..", "..foo", "file."].map(x => extname(x)))'` -> `[".bashrc", ".", ".", ".foo", "."]`. Node's `path.extname` gives `["", "", "", ".foo", "."]`. The doc says files without an extension return `''`, and most people would say `.bashrc` has no extension.
- `extname("foo", "bad")` returns `""`, while `extname("foo.txt", "bad")` throws `'options' argument must be either an object or undefined`, because options are validated after the early return at [src/layer1/api/commands/extname/extname.ts:24-32](src/layer1/api/commands/extname/extname.ts).

### 17. rough-edge - readlink: normalizes the link target and gives errors without a path

- API: `readlink`
- Repro: `cd .tmp/gap-update/commands/lk && ../../../../dist/yavascript -e 'for (const l of ["l1","l2"]) echo(l, JSON.stringify(String(readlink(l))), JSON.stringify(os.readlink(l)))'` (the links point at `dir1/` and `a//b`)
- Actual: `l1 "dir1" "dir1/"` and `l2 "a/b" "a//b"`. The doc says it "Returns the target of the symlink", but the trailing slash, which changes meaning (it forces a directory), is dropped. Wrapping the result in a Path is why.
- Errors: `readlink("a.txt")` (not a link) -> `Error: Invalid argument (errno = 22)`. `readlink("nope")` -> `No such file or directory (errno = 2)`. Neither includes the path, while `realpath`, `cd` and `cat` errors do. A "not a symbolic link" message would help.
- Cause: [src/layer1/api/commands/readlink/readlink.ts:23](src/layer1/api/commands/readlink/readlink.ts).

### 18. doc-mismatch - printf: "the same formats as the standard C library printf" is not true

- API: `printf`
- Repro: `./dist/yavascript -e 'printf("%lld\n", 1)'` -> `TypeError: invalid conversion specifier in format string`.
- Rejected with the same error: `%lld`, `%hd`, `%zu`, `%j`, `%p`, `%n`, `%q`, positional `%1$s`, and a trailing lone `%` (`"100%"`). `%lld` stands out because the doc points people at length modifiers.
- Other behavior worth documenting: `%s` with an object prints `[object Object]` (unlike `echo`, which inspects). `%d` with `"abc"` prints `0` silently. `%d`/`%ld` accept BigInt but `%f` with BigInt throws `cannot convert bigint to number`. A missing argument throws `ReferenceError: missing argument for conversion specifier`. Extra arguments are ignored.

### 19. rough-edge - inconsistencies between sibling commands

- Path arguments: every path-taking command accepts a `Path` except `which`: `./dist/yavascript -e 'which(new Path("ls"))'` -> `TypeError: 'binaryName' must be a string`.
- Multiple paths: `cat` takes an array. `touch(["a","b"])` throws, and `touch("c.txt", "d.txt")` silently creates only `c.txt` (verified). Bash's `touch`, `mkdir` and `chmod` all take several paths.
- Return types: `basename` and `extname` return strings, while `dirname`, `readlink`, `realpath`, `pwd`, `ls` and `which` return `Path`.
- Error style: `mkdir` throws descriptive errors with `path`/`parentPath` properties. `ls` says "Not a directory" for everything. `cat("dir1")` -> `Is a directory (errno = 21)` with no path. `chmod(0o755, "missing")` -> `No such file or directory (errno = 2)` with no path, while the object form includes `path = ...`.
- Declarations: `sleep` is `declare var` while the other commands are `declare const` ([sleep.inc.d.ts:15](src/layer1/api/commands/sleep/sleep.inc.d.ts)). TypeScript users can therefore reassign `sleep` but not the others.

### 20. rough-edge - no `~` expansion anywhere

- APIs: `cd`, `cat`, `ls`, `mkdir`, `touch`, `realpath`
- Repro: `./dist/yavascript -e 'cd("~")'` -> `No such file or directory (errno = 2, target = ~)`. `ls("~")` -> `Not a directory: ~`. `mkdir("~/x")` -> "its parent '~' does not exist". `mkdir("~/x", { recursive: true })` creates a literal `./~/x` (verified in the sandbox: `exists("~")` -> `true` and `ls -la` shows a `~` directory). `touch("~/x")` -> ENOENT.
- Grepping `src/layer1` for `"~"`/`homedir` finds no expansion helper. Only `cd()` with no argument uses `env.HOME`. Bash users will expect `~` to work, so either document that it's literal or provide a helper.

### 21. doc-mismatch (wording) - touch says it updates "creation" time

- [touch.inc.d.ts:2](src/layer1/api/commands/touch/touch.inc.d.ts): "update its creation/modification timestamps". It actually sets access and modification time to now ([touch.ts:35](src/layer1/api/commands/touch/touch.ts), `os.utimes`), and `os.stat` shows both atime and mtime updated. Birth time can't be set this way.
- Undocumented behavior, which matches bash: `touch` on a dangling symlink creates the link's target. `touch("newdir/")` -> `No such file or directory (errno = 2, filename = newdir/, mode = w)`.

### 22. question - the stubs make `typeof cp` throw and `"cp" in globalThis` true

- API: `_stubs.ts` (cp, mv, ren, rm, grep, man, cwd, where, id, openURL, ensureDir)
- Repro: `./dist/yavascript -e 'echo("cp" in globalThis); try { typeof cp } catch (e) { echo("typeof threw:", e.message) }'` prints `true`, then `typeof threw: 'cp' is not defined. Did you mean 'copy'?`.
- A truly undefined global gives `typeof x === "undefined"` without throwing. Feature detection like `typeof id === "undefined"` or `"id" in globalThis` breaks, and `id`/`where`/`man` are common names. Declaring them with `let`/`var`/`function` works fine (verified `let cp = 5`, `function rm() {}`, `var rm = ...`). Each stub's suggestion does exist (all of `copy`, `rename`, `remove`, `grepFile`, `grepString`, `grepArray`, `"".grep`, `[].grep`, `help`, `pwd`, `which`, `whoami`, `openUrl`, `mkdirp` are functions).
- Possible additions for 1.0: `rmdir` -> `remove`, `ln` -> `os.symlink`, `head`/`tail` -> `readFile(...).split("\n")`, `mktemp`.

### 23. gap - whoami drops useful passwd fields

- `./dist/yavascript -e 'std.getpwuid(std.geteuid())'` returns `name, passwd, uid, gid, gecos, dir, shell`, but `whoami()` returns only `{ name, uid, gid }` ([whoami.ts:12-16](src/layer1/api/commands/whoami/whoami.ts)). The home directory and shell are handy for scripts. The doc says "similar to `whoami` and `id`", but there's no group name and no supplementary groups (`id -gn` -> `staff`, `id -G` lists 17 groups).
- Question: `gid` is the passwd primary gid, not `getegid()`. They matched in my environment (`20`/`20`), so I couldn't show a divergence, but the doc doesn't say which one it is.

### 24. gap - commands a 1.0 bash replacement might be expected to have

I checked each against the top-level declarations in [yavascript.d.ts](yavascript.d.ts) (`grep '^declare (function|const|var)'`) and by probing `typeof globalThis[name]`:

| Missing | Closest existing thing |
| --- | --- |
| reading stdin (`cat -`, `read`) | `cat("/dev/stdin")` (undocumented, needs `/dev/stdin`) or raw `std.in.readAsString()` |
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
- `cat`: single file, `Path`, arrays mixing strings and Paths, `[]` (-> `""` / empty ArrayBuffer), symlink to file, unicode names and content, invalid UTF-8 (decoded with U+FFFD), `{ binary: true }` exact bytes, `/dev/null`, `/dev/fd/3`. Errors for missing files, dangling links, dirs, `file/` and bad `options` types.
- `cd`: relative, absolute, `/`, trailing slash, unicode, spaces, `Path`, symlinked dir. No argument, `undefined` or `null` go to `$HOME`. With `HOME` unset you get a clear error. Clear errors for missing paths, files, dangling links and wrong types. `exec` children run in the new cwd.
- `pwd` / `pwd.initial`: returns a `Path`. `pwd.initial` is frozen and holds the startup cwd even when `cd` runs before `pwd` is first touched, in both `-e` and script modes. After the cwd is deleted, `pwd()` throws ENOENT.
- `chmod`: octal numbers, octal strings (`"755"`, `"0755"`, `"4755"`), `Path` input. Object form: every documented Who and Permission, `add`/`set`/`remove`, multiple keys. Malformed octal strings are rejected. Clear errors for a bad operation, bad Who, bad Permission, wrong arity and swapped args.
- `echo`: no args (blank line), multiple args, objects, Paths, BigInt, Symbol. Output matches `console.log`.
- `printf`: `%s %d %i %f %x %X %o %c %e %g %a %%`, flags `- 0 + space`, `*` width, precision, `%ld` 64-bit, BigInt with `%d`/`%ld`, unicode (byte-width padding, like C). No trailing newline. A non-string format gives a clear TypeError.
- `exit`: `exit(n)`, `exit()` uses `exit.code`, `exit.code` used on normal exit, exit from `setTimeout`, `.then`, and async functions after `await` (pending timers and intervals don't run), stdout flushed on exit (including partial lines). `exit` is immediate (a `finally` block doesn't run, like `process.exit`). An uncaught error exits 1 regardless of `exit.code`. `exit()` in a Worker throws.
- `ls`: no args, `.`, relative, trailing slash, `Path`, empty dir, unicode, spaces, hidden files included, sorted output. Results are absolute `Path`s and JSON-serialize to strings.
- `mkdir`/`mkdirp`: relative (other than a bare name, see finding 1) and absolute paths, nested with and without `recursive`, existing-dir error vs. recursive no-op, file-collision and parent-is-file errors, symlink-to-dir handled as a dir, `..`/`.` segments, `mode` honored (after umask), custom `logging` hooks, option type validation. A dangling symlink gives a raw EEXIST, as bash does.
- `readlink`: relative and absolute targets, dangling links, `Path` input. Returns a `Path`.
- `realpath`: `.`, `..`, symlinks to files and dirs, `dir/../x`, unicode, `/tmp` -> `/private/tmp`, `Path` input. ENOENT with the path for dangling links, missing paths and `""`.
- `sleep`: `sleep(100)` / `sleep.sync(100)` block for at least 100 ms (timers don't run during them). `sleep.async(100)` resolves to `undefined` after at least 100 ms, and timers do run meanwhile. Negative or zero values return immediately. Missing, `NaN` or non-number arguments throw a TypeError, and `sleep.async` rejects with one.
- `touch`: creates an empty file (`0o644` with umask 022), updates atime/mtime on existing files without truncating, works on dirs, symlinks (updates the target), read-only files you own, unicode and spaces, `Path` input. Clear TypeError for bad input.
- `which`: PATH order, only regular executable files (dirs, non-executable files and dangling symlinks are skipped), finds symlinked binaries, dirs with spaces, `searchPaths` (strings and Paths, overriding PATH), `suffixes`, `logging.trace`. An unset `PATH` gives `null`, and an empty `PATH` entry searches the cwd, like `/usr/bin/which`. Option types validated clearly.
- `whoami`: `name`/`uid`/`gid` match `whoami`, `id -u` and `id -g`.
- Stubs: all 11 throw the documented "did you mean" ReferenceError on access, and each suggested replacement exists. User code can override them with assignment, `var`, `let` or `function`.

## Test coverage notes

Tests are in [meta/tests/src/](meta/tests/src/). Important untested behavior:

- `chmod`: only the `"remove"`, `"go"` and malformed-string cases are tested. Nothing covers `"set"` (finding 7), numeric permissions (finding 9), or the ordinary number and octal-string paths.
- `touch`: no tests at all (create vs. update, mtime change, content preserved).
- `dirname`: only absolute paths are tested.
- `basename`: no root, empty or trailing-slash cases.
- `extname`: no dotfile, `.`/`..`, or `file.` cases.
- `cat`: no error cases (missing file, dir, dangling link), no `Path` input, no empty array, no symlink.
- `ls`: no tests for a symlinked dir or realpath behavior, a file argument, or a missing dir.
- `mkdir`: good error-path coverage, but no tests for a bare relative name (finding 1), `mode`, symlinked dirs or dangling symlinks. The recursive "relative path" and "absolute path" tests (via the option and via `mkdirp`) snapshot an empty stderr, so they pin the missing info line from finding 10 instead of testing it.
- `which`: no tests for names with slashes (finding 4), relative search paths, or non-executable files shadowed by later executable ones.
- `sleep`: no assertion that it actually waited. The invalid-argument test only checks that `sleep`/`sleep.sync` don't hang, not the TypeError or `sleep.async`'s rejection.
- `exit`: no tests for out-of-range or invalid values, exit from a timer/promise/async function, or `exit.code` in a Worker (finding 5). [worker.test.ts](meta/tests/src/worker.test.ts) covers only `exit()` in a Worker.
- `cd`/`pwd`: no tests for `cd()` -> HOME, missing or empty HOME, error messages, symlinked dirs (logical vs physical), or `env.PWD` (finding 12). The `pwd.initial` test calls `pwd()` before `cd`, so it can't catch a lazily captured initial value. Manually, I found the value is captured correctly anyway.
- `printf`: one happy-path test. Nothing for BigInt, `%ld`, unsupported specifiers or a missing argument.
- `readlink`: no tests for non-link or missing paths, or for trailing-slash targets (finding 17).
- `whoami`: only checks shape and types.
- Stubs: [globals.test.ts](meta/tests/src/globals.test.ts) only snapshots "get throws error" and never checks the message text or the `typeof` behavior.
