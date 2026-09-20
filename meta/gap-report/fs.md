# API audit: filesystem, Path, `__filename` / `__dirname`

Binary: `dist/yavascript` (`--version` prints `git-3eedd831a85c`), macOS. In the repros below, `Y=/Users/suchipi/Code/yavascript/dist/yavascript`. Each one runs in a scratch dir (I used `.tmp/api-audit/fs-sandbox/`). Scratch scripts and their outputs are kept there: `t-writefile.js`, `t-predicates.js`, `t-path.js` / `t-path.out`, `fn-test/`.

`Path` has no method bodies of its own. Most of them come from the `nice-path@3.2.2` dependency, so a lot of the source references point to `node_modules/nice-path/dist/index.js` (abbreviated `nice-path:LINE`).

## Findings

Sorted most severe first. Severity is one of bug / doc-mismatch / gap / rough-edge / question.

### 1. bug - `remove`: follows symlinks to directories and deletes the target's contents

- Repro (link at top level): `mkdir victim && echo keep > victim/keep.txt && mkdir victim/nested && ln -s victim top-link && $Y -e 'remove("top-link")' </dev/null; ls -R victim`
- Repro (link inside the tree being removed): `mkdir -p victim tree && echo keep > victim/keep.txt && ln -s ../victim tree/link && $Y -e 'remove("tree")' </dev/null; ls victim`
- Expected: behaves like `rm -rf`, which removes only the link. `victim/` and everything in it survive.
- Actual: exit 0, and `victim/` is left empty in both cases. `keep.txt` and `nested/` are gone.
- Related: a tree holding a link to its own parent (`tree/up -> ..`) makes `remove("tree")` recurse through `tree/up/tree/up/...` until `Error: Too many levels of symbolic links (errno = 62, ...)`. By then `tree/t.txt` has already been deleted. `rm -rf tree` succeeds.
- Cause: `src/layer1/api/filesystem/remove.ts:22` calls `isDir(path)`, and `isDir` follows symlinks (`src/layer1/api/filesystem/isDir.ts:30-31`). So a link counts as a directory and gets recursed into. Fix: check `isLink` first (or use lstat) and just `os.remove` a link.

### 2. bug - `copy` with `whenTargetExists: "overwrite"`: no truncation, so the target is corrupted

- Repro: `printf 'SRC-A' > a.txt; printf 'THIS TARGET IS MUCH LONGER THAN THE SOURCE' > t.txt; $Y -e 'copy("a.txt", "t.txt", {whenTargetExists: "overwrite"}); JSON.stringify(readFile("t.txt"))' </dev/null`
- Expected: `"SRC-A"`
- Actual: `"SRC-ATARGET IS MUCH LONGER THAN THE SOURCE"`
- Cause: `src/layer1/api/filesystem/copy.ts:58` opens the target with `os.O_WRONLY | os.O_CREAT` and no `os.O_TRUNC`.

### 3. bug - `copy` file into a dir: ignores `whenTargetExists` and silently overwrites (and corrupts) `dir/<name>`

- Repro: `printf 'SRC-A' > a.txt; mkdir destdir; printf 'EXISTING LONGER CONTENT IN DEST' > destdir/a.txt; $Y -e 'copy("a.txt", "destdir"); JSON.stringify(readFile("destdir/a.txt"))' </dev/null`
- Expected: the default `whenTargetExists: "error"` throws `File already exists`, the same as the file -> file case.
- Actual: exit 0, stderr `copy: a.txt -> destdir/a.txt`, and the content is now `"SRC-AING LONGER CONTENT IN DEST"`.
- Cause: the `"file -> dir"` branch at `copy.ts:188-195` calls `copyRaw` directly and never checks whether the target exists. The corruption is finding 2.

### 4. bug - `Path.prototype.relativeTo`: infinite loop when the path equals `dir`

- Repro: `timeout 5 $Y -e 'new Path("/a/b").relativeTo("/a/b").toString()' </dev/null; echo $?` (also `new Path("a").relativeTo("a")` and `new Path(pwd()).relativeTo(pwd())`)
- Expected: `"."` (or `""` with `noLeadingDot`).
- Actual: hangs. Exit 124 from `timeout` in all three cases.
- Cause: `nice-path:214-217` runs `while (ownSegments[0] === dirSegments[0]) { shift both }`. Once both arrays are empty, `undefined === undefined` stays true forever.

### 5. bug - `Path.prototype.replaceAll`: infinite loop when the replacement is empty (removing segments)

- Repro: `timeout 5 $Y -e 'new Path("a/b").replaceAll("a", []).toString()' </dev/null; echo $?` (also `new Path("x/a/a/y").replaceAll("a", [])`)
- Expected: `"b"` and `"x/y"`. The nice-path source itself says "to remove segments, use an empty Array for `replacement`".
- Actual: hangs, exit 124.
- Cause: `nice-path:386-402`. `searchIndex = matchingIndex + replacement.segments.length` never advances when the replacement is empty, and `this.indexOf` keeps searching the original path, not `currentPath`.

### 6. bug - `Path.prototype.replaceAll`: wrong results when the replacement is longer than the value

- Repro: `$Y -e '[new Path("a/a/a").replaceAll("a", "b/c").toString(), new Path("a/x/a").replaceAll("a", "a/b").toString()]' </dev/null`
- Expected: `"b/c/b/c/b/c"` and `"a/b/x/a/b"`.
- Actual: `"b/c/b/c/a"` (the last match is never replaced) and `"a/b/b/x/a"` (it replaced inside its own earlier replacement).
- Cause: `nice-path:386-402` mixes indexes from the original path with `currentPath.replace(...)`, which always replaces the *first* match in the already-modified path.

### 7. bug - `Path.normalize` / `Path#normalize`: a relative path can become `/`, and an absolute path can become relative

- Repro: `$Y -e '["a/..", "a/b/../..", "/a/../../b", "/../x", "C:\\a\\..\\.."].map(p => Path.normalize(p).toString())' </dev/null`
- Expected: `"."`, `"."`, `"/b"`, `"/x"`, `"C:\"`
- Actual: `"/"`, `"/"`, `"b"`, `"x"`, `"/"`
- Why it matters: `rename` normalizes its arguments (finding 9). An innocent `"dir/.."` therefore turns into the filesystem root.
- Cause: `nice-path:137-144`. `..` pops the leading `""` root segment of absolute paths, and popping the last relative segment leaves `segments: []`, which `toString` renders as `/` (`nice-path:236-237`).

### 8. bug - empty-segment Paths stringify as `/`: `dirname` of a one-segment relative path, `new Path("")`, and `new Path()` all mean root

- Repro: `$Y -e '[new Path("a.txt").dirname().toString(), dirname("a.txt").toString(), new Path(".").dirname().toString(), new Path().toString(), new Path("").toString(), new Path("", "etc").toString()]' </dev/null`
- Expected: `"."`, `"."`, `"."` (POSIX `dirname a.txt` prints `.`), and something non-root for empty input (or a thrown error).
- Actual: `"/"`, `"/"`, `"/"`, `"/"`, `"/"`, `"/etc"`
- Knock-on effects I verified:
  - `$Y -e '[exists(""), exists(new Path("")), isDir(new Path("a.txt").dirname())]'` gives `[false, true, true]`. The same empty input means "nothing" as a string but "root" as a Path.
  - `new Function("return __dirname")()` returns `"/"` (see finding 20).
  - `Path.isAbsolute("")` is `true` but `new Path().isAbsolute()` is `false`, even though both print as `/`.
- Why it matters: `new Path(maybeEmptyVar, "tmp")` silently becomes `/tmp`, and `remove(new Path(x).dirname())` would target `/`. I did not run that one.
- Cause: `nice-path:236-237` (`if (result == "") return "/"`) and `nice-path:277-279` (`dirname` = `replaceLast([])`).

### 9. bug - `rename`: normalizes paths lexically before calling the OS, so it can move the wrong file and turns `""` into `/`

- Repro: `mkdir -p real/deep && printf REAL > real/x.txt && printf CWD > x.txt && ln -s real/deep L && $Y -e 'const r = readFile("L/../x.txt"); rename("L/../x.txt", "moved.txt"); [r, readFile("moved.txt"), exists("x.txt"), exists("real/x.txt")]' </dev/null`
- Expected: moves `real/x.txt`, which is what the OS path means. `readFile("L/../x.txt")` returns `REAL`, and `mv` would move that same file.
- Actual: `["REAL", "CWD", false, true]`. It moved `./x.txt`.
- Also:
  - `$Y -e 'rename("", "zzz")'` throws `Is a directory` with `from: "/"`. It tried to rename the root.
  - `rename("f.txt/", "g.txt")` succeeds, whereas `mv f.txt/ h.txt` fails with `Not a directory`.
- Cause: `src/layer1/api/filesystem/rename.ts:20-21` (`Path.normalize(...)`), combined with finding 7. No other function in this area normalizes.

### 10. bug - `copy`: follows directory symlinks, so a link to an ancestor causes a runaway copy

- Repro: `mkdir src-loop && echo l > src-loop/l.txt && ln -s .. src-loop/parent-link && timeout 20 $Y -e 'copy("src-loop", "dst-loop", {logging: {info(){}}})' </dev/null; find dst-loop | wc -l`
- Expected: `cp -R` semantics, meaning the link is copied as a link and there are 3 entries.
- Actual: it copies the whole parent directory (including `dst-loop` itself) over and over, creating 337 entries until `Error: File name too long (errno = 63, path = dst-loop/parent-link/src-loop/parent-link/...)`.
- Cause: `_getPathInfo` (`src/layer1/api/filesystem/_getPathInfo.ts:9-19`) resolves links to `"dir"` or `"file"`, and `copy.ts:176-177` / `226-231` recurse into them.

### 11. bug - `copy` a dir into itself or onto itself: runaway recursion, then a misleading error

- Repro: `mkdir -p selfsrc/x && echo s > selfsrc/x/s.txt && timeout 20 $Y -e 'copy("selfsrc", "selfsrc/x", {logging:{info(){}}})' </dev/null; find selfsrc | wc -l` (also `copy("d", "d")`)
- Expected: an up-front error ("cannot copy a directory into itself"). macOS `cp -R selfsrc selfsrc/x` exits 0 and copies exactly one level (6 entries total).
- Actual: `Error: Source path does not exist: .../selfsrc/x/selfsrc/x/selfsrc/x/...`, leaving 193 entries behind (108 for `copy("d","d")`).
- Cause: the `"dir -> dir"` branch at `copy.ts:234-247` lists children lazily while it creates new ones inside the source.

### 12. bug - `copy` into an existing tree nests subdirectories (`sub/sub`) instead of merging

- Repro: `mkdir -p src/sub src/emptydir && echo B > src/sub/b.txt && $Y -e 'for (let i = 0; i < 3; i++) copy("src", "dst", {whenTargetExists: "overwrite", logging:{info(){}}})' </dev/null; find dst/src | sort`
- Expected (what `cp -R src dst` gives when run three times): `dst/src/{a.txt,emptydir,sub/b.txt}`
- Actual: also contains `dst/src/sub/sub/b.txt` and `dst/src/emptydir/emptydir`.
- Cause: the recursive calls at `copy.ts:230` and `copy.ts:245` pass `target = <to>/<childname>`. When that child dir already exists, it hits the top-level `"dir -> dir"` branch, which copies *into* it (`copy.ts:236-237`) instead of merging.

### 13. bug - `readFile(path, {binary: true})` silently truncates non-regular files (pipes)

- Repro: `( printf aaa; $Y -e 'sleep(0.5)' </dev/null; printf bbb ) | $Y -e 'readFile("/dev/stdin", {binary: true}).byteLength'`
- Expected: `6`
- Actual: `3`, exit 0, and no error.
- Also: string mode on a pipe fails. `printf x | $Y -e 'readFile("/dev/stdin")'` gives `Error: Illegal seek (errno = 29, filename = /dev/stdin)`.
- Cause: `src/layer1/api/filesystem/readFile.ts:42-46` sizes the buffer from `os.stat(path).size` and ignores `file.read`'s return value. String mode uses `std.loadFile`, which seeks. (`std.in.readAsString()` exists for stdin, but `readFile("/dev/stdin")` or a `<(cmd)` path is what a bash user will reach for.)

### 14. bug - `copy`: a failed open is masked by a `utimes` error, and a failed copy still changes the target's mtime

- Repro (error masking): `mkdir ro-dir && chmod 555 ro-dir && echo x > a.txt && $Y -e 'copy("a.txt", "ro-dir")' </dev/null`
- Expected: `Permission denied`
- Actual: `Error: No such file or directory (errno = 2, path = ro-dir/a.txt)` with the stack `at utimes (native)`. Copying to `no/such/dir/a.txt` is reported from `utimes` in the same way.
- Repro (mtime side effect): `touch -t 202001020304 a.txt; echo 'RO TARGET' > ro.txt; chmod 444 ro.txt; $Y -e 'copy("a.txt", "ro.txt", {whenTargetExists: "overwrite"})' </dev/null; ls -l ro.txt`
- Expected: throws, and `ro.txt` is left untouched.
- Actual: throws `Permission denied`, but `ro.txt` now has mtime `Jan 2 2020`, copied from the source.
- Cause: `copy.ts:90-101`. The `finally` block always calls `os.utimes(to, ...)` and rethrows its error.

### 15. bug - `remove(".")` deletes everything in cwd, then throws

- Repro (in a throwaway dir): `mkdir -p d/a && touch d/a/1.txt d/2.txt && cd d && $Y -e 'remove(".")' </dev/null; ls -a`
- Expected: `rm -rf .` refuses up front (`rm: "." and ".." may not be removed`, exit 1) and deletes nothing.
- Actual: every entry in cwd is deleted, and then it throws `Error: Invalid argument (errno = 22)`.
- Cause: `remove.ts:22-33` recurses first and then calls `os.remove(".")`.

### 16. doc-mismatch - `copy` is documented as `cp -R` but differs in several ways

1. Symlinks are dereferenced. `src/link-to-a -> a.txt` becomes a regular file in the destination, while `cp -R` makes a symlink (`ls -la cpdst/link-to-a` shows `-> a.txt`).
2. A dangling symlink aborts the copy partway through. `mkdir s && echo ok > s/ok.txt && ln -s nowhere s/dead && $Y -e 'copy("s","d")'` throws `Source path does not exist: .../s/dead` and leaves `d/` partially populated. What got copied depends on directory listing order: `ok.txt` was copied in one run (in `copy-test/src-dead`), and `d/` was left empty in another where `ls("s")` listed `dead` first.
3. Directory modes are not preserved. `mkdir -p p/private && chmod 700 p/private && $Y -e 'copy("p","q")'; ls -ld q/private` gives `drwxr-xr-x`, while `cp -R` keeps `drwx------`. A private directory becomes world-listable. Mkdir happens at `copy.ts:224` and `239` with no mode.
4. File atime/mtime are preserved (`out-a.txt` kept `Jan 2 2020`), which plain `cp -R` does not do. This is fine behavior but undocumented.
5. `whenTargetExists` never applies to directories: an existing dir is always merged into. Also undocumented.

### 17. doc-mismatch - `rename` is documented as `mv` but cannot move things into directories

- Repro:
  - `echo 3 > three.txt; mkdir dirA; $Y -e 'rename("three.txt", "dirA")'` gives `Error: Is a directory (errno = 21)`. `mv` moves the file into `dirA/`.
  - `mkdir -p dirA dirB/nonempty; $Y -e 'rename("dirA", "dirB")'` gives `Directory not empty (errno = 66)`. `mv` makes `dirB/dirA`.
  - `mkdir dirA emptyC; echo x > dirA/a.txt; $Y -e 'rename("dirA", "emptyC")'` succeeds and silently *replaces* `emptyC`, leaving `emptyC/a.txt`. `mv` would make `emptyC/dirA/a.txt`.
- Also: unlike `copy`, there is no `whenTargetExists` option. `rename` over an existing file always clobbers it.
- Cause: `rename.ts:27` is a bare `os.rename`.

### 18. doc-mismatch - `remove` throws on a missing path, but the docs say it's `rm -rf`

- Repro: `$Y -e 'remove("missing-thing")' </dev/null; echo $?` and compare with `rm -rf missing-thing; echo $?`
- Expected: a silent no-op, like `rm -rf` (exit 0).
- Actual: `Error: No such file or directory (errno = 2)`, exit 1. The message does not include the path.
- Cause: `remove.ts:33`

### 19. doc-mismatch - the `Path` class docs say every path-accepting function also accepts Path objects, but `splitToSegments` and `detectSeparator` reject them

- Repro: `$Y -e 'Path.splitToSegments(new Path("a/b"))'` and `$Y -e 'Path.detectSeparator(new Path("a/b"))'`
- Expected: works, per the class doc ("All functions in yavascript which accept path strings as arguments also accept Path objects").
- Actual: `TypeError: Expected value of type union(string, arrayOf(string)), but received "a/b"`
- Cause: `src/layer1/api/path/path.ts:24-27` and `36`

### 20. doc-mismatch - `__filename` is not always "the absolute path to the currently-executing file"

- Repro: `$Y -e 'echo(__filename); echo(exists(__filename))'` prints `<cwd>/<evalScript>` and `false`. That is a synthetic, nonexistent path, and the docs don't mention it.
- Repro: `$Y -e 'JSON.stringify([new Function("return __filename")(), new Function("return __dirname")()])'` prints `["<input>","/"]`: a relative, fake filename, and root as `__dirname` (because of finding 8).
- Repro: `Reflect.get(globalThis, "__filename")` inside a script throws `Error: Cannot determine the caller filename for the given stack level. Maybe you're using eval?`. The native frame shifts the stack depth that `_install-api.ts:214` hardcodes as `get__filename(2)`. Direct access, `globalThis.__filename`, destructuring from `globalThis`, and calling the descriptor's getter all work.

### 21. doc-mismatch - `Path.prototype.relativeTo` is purely lexical, which the docs don't say, and gives wrong answers for unnormalized or mixed input

- Repro: `$Y -e '[new Path("/a/c").relativeTo("/a/b/.."), new Path("/a/b/../c").relativeTo("/a"), new Path("a/b").relativeTo("/x")].map(String)'`
- Expected: `"./c"` (because `/a/b/..` is `/a`), `"./c"`, and either an error or a cwd-resolved answer for relative vs absolute input.
- Actual: `"../../c"` (wrong), `"./b/../c"`, and `"../../a/b"` (meaningless).
- Also: the options argument isn't validated. `relativeTo("/a", "yes")` is accepted.
- Cause: `nice-path:208-230`

### 22. doc-mismatch - `Path.from` exists and is bound as public API, but it is undocumented

- Repro: `$Y -e 'String(Path.from(["a","","b"]))'` prints `"a/b"`. `typeof Path.from` is `"function"`.
- It's bound deliberately at `src/layer1/api/path/path.ts:184` but missing from `path.inc.d.ts`, so it isn't typed or documented. This matters because it's the validating counterpart to `fromRaw`: `Path.fromRaw(["a","","b"],"/")` produces `"a//b"`.

### 23. doc-mismatch (minor) - `isFile` follows symlinks, but only `isDir`'s doc says so

- Repro: in a dir with `link-file -> file.txt`, `$Y -e 'isFile("link-file")'` prints `true`, and `isFile` of a dangling link is `false`.
- The `isDir` doc spells out its symlink behavior. The `isFile` doc ("points to a regular file") doesn't.

### 24. gap - `writeFile` only takes `string | ArrayBuffer`, not typed arrays or DataView, and `.buffer` is a trap

- Repro: `$Y -e 'writeFile("w.bin", new Uint8Array([0,1,2,255]))'` gives `TypeError: 'data' argument must be either a string or an ArrayBuffer`. The same happens for a `DataView`.
- The obvious workaround is wrong for views. `const u = new Uint8Array([9,9,1,2,9]).subarray(2,4); writeFile("w.bin", u.buffer)` writes 5 bytes, not 2.
- Cause: `writeFile.ts:17-21`

### 25. gap - no high-level stat, append, symlink creation, or temp file/dir API

I grepped `yavascript.d.ts` and none of these exist as yavascript-level functions:

| Missing | What exists instead |
| --- | --- |
| stat (size, mtime, mode, type) | raw `os.stat` / `os.lstat` (the `os` global) |
| append to a file | only raw `os.open` with `os.O_APPEND` |
| create a symlink (`ln -s`) | raw `os.symlink(target, linkpath)` |
| temp dir / named temp file (`mktemp`) | `std.tmpfile()` returns an anonymous `FILE` with no name; nothing like `mkdtemp` |

Also missing: a `rename` that falls back to copy+remove across filesystems (see the coverage notes, I didn't verify it). For comparison, `touch`, `chmod`, `mkdir`, `ls`, `readlink`, `realpath`, and `glob` do exist.

### 26. rough-edge - errors often leave out the path, and error shapes differ between siblings

- `$Y -e 'isReadable("missing")'` gives `Error: No such file or directory (errno = 2)` with no path property. The same goes for `isExecutable`, `remove` (see finding 18), and `rename` (`rename.ts:29-33` attaches `from`/`to` properties, but the message doesn't include them).
- `readFile("nope.txt")` puts the path in `filename`. `readFile("nope.txt", {binary:true})` puts it in `path` instead.
- `readFile("somedir")` gives `Error: Input/output error (errno = 5, ...)`, which is confusing. With `{binary:true}` it gives `Error: Is a directory (errno = 21)` with no path at all.

### 27. rough-edge - `isWritable` returns `false` for missing paths while `isReadable`/`isExecutable` throw

- Repro: in a writable dir, `$Y -e 'isWritable("missing")'` prints `false`, while `isReadable("missing")` and `isExecutable("missing")` throw.
- The doc's wording "could be written to" suggests `true` here, since `writeFile("missing", ...)` would succeed.
- Cause: `isWritable.ts:15-19` doesn't run the `F_OK` pre-check that `isReadable.ts:16` / `isExecutable.ts:16` do.
- The throwing siblings also throw on things other than "nothing exists", which the doc doesn't mention: `Not a directory` for `"file.txt/"`, `Permission denied` for a path under a mode-000 dir, and `Too many levels of symbolic links` for a looping link.

### 28. rough-edge - a trailing slash changes fs results depending on whether you pass a string or a Path

- Repro (with `link-dir -> dir`, `file.txt`): `$Y -e '[isLink("link-dir/"), isLink(new Path("link-dir/")), exists("file.txt/"), exists(new Path("file.txt/"))]'` prints `[false, true, false, true]`.
- `new Path("a/")` drops the trailing slash (segments `["a"]`), so the "follow the link" / "must be a dir" meaning of `/` is lost.

### 29. rough-edge - `copy`'s default logging writes ANSI escapes even when stderr is redirected

- Repro: `$Y -e 'copy("a.txt", "b.txt")' 2>err.log; od -c err.log | head -2` shows `033 [ 2 m copy: a.txt -> b.txt 033 [ 2 2 m`.
- Every copied file logs by default. That's documented, but the color codes aren't TTY-gated.
- Cause: `src/layer1/api/logger/logger.ts:15` always wraps output in `dim(...)`.

### 30. rough-edge - unclear type errors from `copy` options and from `Path`

- `copy("a","b",{logging: null})` gives `TypeError: cannot convert to object`, because the destructuring at `copy.ts:137-140` happens before validation.
- `Path` methods give generic messages like `new Path(42)` -> `TypeError: Expected value of type arrayOf(union(string, Path, arrayOf(union(string, Path)))), but received [42]`. `new Path(undefined)` shows `received ["<undefined>"]`. The fs functions have clear messages like `'path' argument must be either a string or a Path object`.

### 31. rough-edge - `Path.isAbsolute` treats any `X:` prefix as absolute, even on POSIX

- Repro: `$Y -e '[Path.isAbsolute("c:thing"), Path.isAbsolute("C:x"), Path.isAbsolute("")]'` prints `[true, true, true]`.
- `c:thing` is a valid relative filename on macOS/Linux, and `C:x` is drive-relative (not absolute) on Windows.
- Cause: `nice-path:178`

### 32. rough-edge - "readonly" statics can be reassigned

- Repro: `$Y -e 'Path.OS_SEGMENT_SEPARATOR = "X"; Path.OS_SEGMENT_SEPARATOR'` prints `"X"`, and the new value sticks (used as the `fromRaw` and `detectSeparator` default).
- The typings say `static readonly`.
- Cause: `path.ts:15-21`

### 33. rough-edge - string encoding edge cases are silent

- `writeFile("w.txt", "a\ud800b")` writes bytes `61 ED A0 80 62`, which is invalid UTF-8 (a lone surrogate encoded as WTF-8).
- `readFile` of invalid UTF-8 (`ff fe 00 61 62 63 c3`) returns `"\ufffd\ufffd\u0000abc\ufffd"` with no warning. The docs just say "reads the file as UTF-8".

### 34. question - `extname(".bashrc")` returns `".bashrc"`

- Repro: `$Y -e '[new Path(".bashrc").extname(), extname(".bashrc"), new Path(".bashrc").extname({full:true})]'` prints all `".bashrc"`.
- Node's `path.extname(".bashrc")` returns `""`, because a leading dot marks a hidden file, not an extension. Is this intended? Either way, worth documenting.

### 35. question - Windows: separator fallback for single-segment paths

- `nice-path:81` builds the separator with `detectSeparator(parts, "/")`, a hardcoded `"/"`, instead of `Path.OS_SEGMENT_SEPARATOR`. On Windows, `new Path("foo").concat("bar")` would therefore presumably be `foo/bar`.
- I can only confirm the code path here. On macOS `new Path("foo").separator` is `"/"` either way. The docs promise `OS_SEGMENT_SEPARATOR` as the default only for `fromRaw` and `detectSeparator`, so this may be intended.

### 36. question - smaller `Path` oddities

- `new Path("/a/b").startsWith("")` is `true`, but `new Path("a/b").startsWith("")` and `new Path("/a/b").endsWith("")` are `false`. That's because `""` parses to the root segment `[""]`.
- `indexOf("a", -1)` and `indexOf("a", -100)` on `/a/b/a` return `1`. Negative `fromIndex` is treated like 0, not as an offset from the end like `Array.prototype.indexOf`.
- `isExecutable("dir")` is `true` (search permission). That matches `test -x`, but a user checking "is this runnable" should know it.
- `__filename` / `__dirname` are strings, while `pwd()`, `dirname()`, and `realpath` return Paths. The docs are consistent with this, but it's inconsistent across the API.

## Verified working

- **readFile**
  - UTF-8 string mode, `{}`, `{binary:false}`, and `{binary:true}` (ArrayBuffer with correct bytes).
  - Path argument, empty file, `/dev/null`, unknown option keys ignored.
  - Clear TypeErrors for bad `path`, `options`, and `binary`.
  - Permission-denied errors.
- **writeFile**
  - UTF-8 strings including non-ASCII, ArrayBuffer, and Path arguments.
  - Truncates on overwrite, empty string, NUL characters, unicode and spaces in names.
  - Writes through symlinks and dangling symlinks (same as shell `>`).
  - Clear errors for a missing parent dir, a directory target, permission denied, and bad data.
- **exists**: matches `test -e` for files, dirs, symlinks, dangling and looping links (`false`), fifos, `/dev/null`, `""`, `.`, `..`, `/`, and Path arguments.
- **isDir**: follows links as documented (dangling link `false`).
- **isLink**: `true` for dangling and looping links, `false` for `link-dir/` (trailing slash follows the link).
- **isFile**: `false` for fifos and `/dev/null`.
- **Predicates overall**
  - `isReadable`/`isExecutable` throw on missing paths as documented.
  - Mode-000 files and dirs report `false`, and exec bits are detected.
  - All 7 predicates accept Paths and reject non-string/Path values with a clear TypeError.
- **remove**: files, empty dirs, nested dirs, trailing slash, dangling links (removes just the link), mode-000 files in a writable dir, and Path arguments.
- **copy**
  - file -> new path, preserving mode bits (750 stays 750) and mtime.
  - The default `"error"` for file -> file, `"skip"`, dir -> new dir (including empty subdirs), and dir -> existing dir creating `dst/src` like `cp -R`.
  - dir -> existing file errors, and a missing source errors.
  - Path arguments, unicode and spaces in names, and custom `logging.info` / `logging.trace` (trace output is detailed and useful).
  - Bad `whenTargetExists` and non-function loggers are rejected clearly.
  - Copying a file onto itself with overwrite leaves the content intact.
- **rename**: file -> new name, overwriting an existing file, renaming a symlink renames the link itself, and extra `from`/`to` properties on errors.
- **Path**
  - `OS_SEGMENT_SEPARATOR` `/`, `OS_ENV_VAR_SEPARATOR` `:`, `OS_PROGRAM_EXTENSIONS` an empty Set on macOS.
  - `isPath` (rejects duck-typed objects and null).
  - `splitToSegments` (including arrays and double slashes), `detectSeparator` (including the null fallback).
  - `fromRaw` (default separator, no validation as documented).
  - The constructor with multiple, array, and Path inputs, Windows drive and UNC paths, unicode.
  - `normalize` on the documented cases.
  - `concat` keeps the target's separator.
  - `clone` (independent segments array, `instanceof Path`).
  - `relativeTo` on the documented cases plus `noLeadingDot`.
  - `toString`, `toJSON`/`JSON.stringify`, template literals.
  - `basename`, `extname` including `{full:true}`, `dirname` for multi-segment paths.
  - `startsWith`, `endsWith`, `indexOf` (including `fromIndex` and multi-segment values), `includes`, `replace` (first match only, `[]` removes), `replaceLast`.
  - `equals` vs `hasEqualSegments` (separator sensitivity).
  - Static methods work when detached (`const { normalize } = Path`).
  - `Path("a")` without `new` throws a clear error.
- **__filename / __dirname**
  - Correct absolute values in a script file, an imported ESM module (including a function exported from it and called from elsewhere), a `require()`d CJS module, a `.ts` script, and a dir with spaces and unicode.
  - Also correct inside arrow callbacks, `.then`, `setTimeout`, and direct `eval`.
  - Symlinked scripts resolve to the real path (like Node's main module), and `..` in the script path is resolved.
  - In `-e`, `__dirname` is the cwd.
  - Assigning to them throws `__filename's value cannot be changed`.
  - `const __filename = ...` shadowing works in both scripts and modules (the common Node ESM idiom doesn't break).

## Test coverage notes

- **`meta/tests/src/filesystem.test.ts`**
  - Has `// rename test TODO` at line 447. `rename` has zero tests.
  - `isFile`, `isExecutable`, `isReadable`, and `isWritable` have no behavior tests (only the globals listing in `globals.test.ts` / `context.test.ts`).
  - `copy` has exactly one test (dir -> new dir). Nothing covers `whenTargetExists` (all three values), file -> file, file -> dir, overwrite truncation (finding 2), copying into an existing tree (finding 12), symlinks inside the source (findings 10, 16), `logging` options, or error cases.
  - `remove` has no tests for symlinks (finding 1), missing paths (finding 18), or `"."` (finding 15).
  - `readFile` has no tests for error cases, non-regular files (finding 13), or Path arguments.
  - `writeFile` has no tests for ArrayBuffer, overwrite, or Path arguments.
  - No test anywhere passes a `Path` object to a filesystem function.
- **`meta/tests/src/path.test.ts`**
  - `relativeTo` is never called with equal paths (finding 4) or unnormalized/mixed input.
  - `replaceAll` has only the `"nine/ten"` and `"one" -> "one"` cases. There's none with an empty or longer replacement (findings 5, 6).
  - `normalize` is never tested with `..` that climbs above root or cancels the whole path (finding 7).
  - `dirname` is only tested on a deep absolute path (finding 8).
  - No tests for `isAbsolute`, `concat`, `fromRaw`, `isPath`, `includes`, `OS_ENV_VAR_SEPARATOR`, `OS_PROGRAM_EXTENSIONS`, `new Path("")` / `new Path()` `toString`, or `Path.from`.
- **`meta/tests/src/__filename-and-__dirname.test.ts`** plus the `fixture-scripts` snapshot cover only `-e` and a script importing an ESM module. Uncovered: `require()`d CJS, symlinked scripts, `.ts` files, callbacks/async, `new Function` (finding 20), and shadowing with `const`.
- **Not verified in this audit**:
  - `rename` across filesystems (EXDEV): I didn't test it, to avoid touching anything outside the sandbox. `rename.ts:27` is a bare `os.rename` with no fallback, so it presumably fails where `mv` would succeed.
  - All Windows-specific paths: drive-letter handling via `appendSlashIfWindowsDriveLetter` (which the `isReadable`/`isWritable`/`isExecutable` implementations don't call), the separator fallback (finding 35), and the `stat` path in `isDir`/`isLink` in place of `lstat`.
