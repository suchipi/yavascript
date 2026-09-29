# API audit: filesystem, Path, `__filename` / `__dirname`

Binary: `dist/yavascript` (`--version` prints `git-d8cc554c0810`), macOS. In the repros below, `Y=/Users/suchipi/Code/yavascript/dist/yavascript`. Each one runs in a scratch dir (`.tmp/gap-update/fs/`).

`Path` has no method bodies of its own. Most of them come from the `nice-path@4.0.1` dependency, so a lot of the source references point to `node_modules/nice-path/dist/index.js` (abbreviated `nice-path:LINE`).

## Findings

Sorted most severe first. Severity is one of bug / doc-mismatch / gap / rough-edge / question.

### 1. bug - `copy` a directory to a bare relative name throws `ZeroSegmentsError`

- Repro: `mkdir src && echo a > src/a.txt && $Y -e 'copy("src", "newdir")' </dev/null`
- Expected: copies `src` to `newdir`, like `cp -R src newdir`.
- Actual: `PathErrors.ZeroSegmentsError: 'replaceLast' is attempting to create a Path with zero segments, which is invalid`, exit 1. `copy("src", "./newdir")` and absolute targets work.
- Cause: the copy-into-itself check at `copy.ts:222-228` calls `new Path(to).dirname()` when the target doesn't exist yet, and `dirname` of a one-segment path throws.

### 2. doc-mismatch - `copy` is documented as `cp -R` but preserves file times, and `whenTargetExists` never applies to directories

1. File atime/mtime are preserved (`touch -t 202001020304 a.txt; $Y -e 'copy("a.txt", "out-a.txt")'; ls -l out-a.txt` shows `Jan 2 2020`), which plain `cp -R` does not do. This is fine behavior but undocumented.
2. `whenTargetExists` never applies to directories: an existing dir is always merged into. Also undocumented.

### 3. doc-mismatch - `rename` is documented as `mv` but cannot move things into directories

- Repro:
  - `echo 3 > three.txt; mkdir dirA; $Y -e 'rename("three.txt", "dirA")'` gives `Error: Is a directory (errno = 21)`. `mv` moves the file into `dirA/`.
  - `mkdir -p dirA dirB/nonempty; $Y -e 'rename("dirA", "dirB")'` gives `Directory not empty (errno = 66)`. `mv` makes `dirB/dirA`.
  - `mkdir dirA emptyC; echo x > dirA/a.txt; $Y -e 'rename("dirA", "emptyC")'` succeeds and silently *replaces* `emptyC`, leaving `emptyC/a.txt`. `mv` would make `emptyC/dirA/a.txt`.
- Also: unlike `copy`, there is no `whenTargetExists` option. `rename` over an existing file always clobbers it.
- Cause: `rename.ts:27` is a bare `os.rename`.

### 4. doc-mismatch - the `Path` class docs say every path-accepting function also accepts Path objects, but `splitToSegments` and `detectSeparator` reject them

- Repro: `$Y -e 'Path.splitToSegments(new Path("a/b"))'` and `$Y -e 'Path.detectSeparator(new Path("a/b"))'`
- Expected: works, per the class doc ("All functions in yavascript which accept path strings as arguments also accept Path objects").
- Actual: `TypeError: Expected value of type union(string, arrayOf(string)), but received "a/b"`
- Cause: `src/layer1/api/path/path.ts:26-29` and `38`

### 5. doc-mismatch - `__filename` is not always "the absolute path to the currently-executing file"

- Repro: `$Y -e 'echo(__filename); echo(exists(__filename))'` prints `<cwd>/<evalScript>` and `false`. That is a synthetic, nonexistent path, and the docs don't mention it.
- Repro: `$Y -e 'JSON.stringify(new Function("return __filename")())'` prints `"<input>"`, a relative, fake filename. `new Function("return __dirname")()` throws `PathErrors.ZeroSegmentsError: 'replaceLast' is attempting to create a Path with zero segments, which is invalid`, because `dirname` of the one-segment `<input>` throws.
- Repro: `Reflect.get(globalThis, "__filename")` inside a script throws `Error: Cannot determine the caller filename for the given stack level. Maybe you're using eval?`. The native frame shifts the stack depth that `_install-api.ts:214` hardcodes as `get__filename(2)`. Direct access, `globalThis.__filename`, destructuring from `globalThis`, and calling the descriptor's getter all work.

### 6. doc-mismatch - `Path.prototype.relativeTo` is purely lexical, which the docs don't say, and gives wrong answers for unnormalized or mixed input

- Repro: `$Y -e '[new Path("/a/c").relativeTo("/a/b/.."), new Path("/a/b/../c").relativeTo("/a"), new Path("a/b").relativeTo("/x")].map(String)'`
- Expected: `"./c"` (because `/a/b/..` is `/a`), `"./c"`, and either an error or a cwd-resolved answer for relative vs absolute input.
- Actual: `"../../c"` (wrong), `"./b/../c"`, and `"../../a/b"` (meaningless).
- Also: the options argument isn't validated. `relativeTo("/a", "yes")` is accepted.
- Cause: `nice-path:284-313`

### 7. doc-mismatch - `Path.from` exists and is bound as public API, but it is undocumented

- Repro: `$Y -e 'String(Path.from(["a","","b"]))'` prints `"a/b"`. `typeof Path.from` is `"function"`.
- It's bound deliberately at `src/layer1/api/path/path.ts:196` but missing from `path.inc.d.ts`, so it isn't typed or documented. This matters because it's the validating counterpart to `fromRaw`: `Path.fromRaw(["a","","b"],"/")` produces `"a//b"`.

### 8. doc-mismatch (minor) - `isFile` follows symlinks, but only `isDir`'s doc says so

- Repro: in a dir with `link-file -> file.txt`, `$Y -e 'isFile("link-file")'` prints `true`, and `isFile` of a dangling link is `false`.
- The `isDir` doc spells out its symlink behavior. The `isFile` doc ("points to a regular file") doesn't.

### 9. gap - `writeFile` only takes `string | ArrayBuffer`, not typed arrays or DataView, and `.buffer` is a trap

- Repro: `$Y -e 'writeFile("w.bin", new Uint8Array([0,1,2,255]))'` gives `TypeError: 'data' argument must be either a string or an ArrayBuffer`. The same happens for a `DataView`.
- The obvious workaround is wrong for views. `const u = new Uint8Array([9,9,1,2,9]).subarray(2,4); writeFile("w.bin", u.buffer)` writes 5 bytes, not 2.
- Cause: `writeFile.ts:17-21`

### 10. gap - no high-level stat, append, symlink creation, or temp file/dir API

I grepped `yavascript.d.ts` and none of these exist as yavascript-level functions:

| Missing | What exists instead |
| --- | --- |
| stat (size, mtime, mode, type) | raw `os.stat` / `os.lstat` (the `os` global) |
| append to a file | only raw `os.open` with `os.O_APPEND` |
| create a symlink (`ln -s`) | raw `os.symlink(target, linkpath)` |
| temp dir / named temp file (`mktemp`) | `std.tmpfile()` returns an anonymous `FILE` with no name; nothing like `mkdtemp` |

Also missing: a `rename` that falls back to copy+remove across filesystems (see the coverage notes, I didn't verify it). For comparison, `touch`, `chmod`, `mkdir`, `ls`, `readlink`, `realpath`, and `glob` do exist.

### 11. rough-edge - errors often leave out the path

- `$Y -e 'isReadable("missing")'` gives `Error: No such file or directory (errno = 2)` with no path property. The same goes for `isExecutable`, `remove("missing")`, and `rename` (`rename.ts:29-33` attaches `from`/`to` properties, but the message doesn't include them).
- `readFile("somedir")` gives `Error: Is a directory (errno = 21)` with no path at all, in both string and `{binary:true}` mode.

### 12. rough-edge - `isWritable` returns `false` for missing paths while `isReadable`/`isExecutable` throw

- Repro: in a writable dir, `$Y -e 'isWritable("missing")'` prints `false`, while `isReadable("missing")` and `isExecutable("missing")` throw.
- The doc's wording "could be written to" suggests `true` here, since `writeFile("missing", ...)` would succeed.
- Cause: `isWritable.ts:15-19` doesn't run the `F_OK` pre-check that `isReadable.ts:16` / `isExecutable.ts:16` do.
- The throwing siblings also throw on things other than "nothing exists", which the doc doesn't mention: `Not a directory` for `"file.txt/"`, `Permission denied` for a path under a mode-000 dir, and `Too many levels of symbolic links` for a looping link.

### 13. rough-edge - a trailing slash changes fs results depending on whether you pass a string or a Path

- Repro (with `link-dir -> dir`, `file.txt`): `$Y -e '[isLink("link-dir/"), isLink(new Path("link-dir/")), exists("file.txt/"), exists(new Path("file.txt/"))]'` prints `[false, true, false, true]`.
- `new Path("a/")` drops the trailing slash (segments `["a"]`), so the "follow the link" / "must be a dir" meaning of `/` is lost.

### 14. rough-edge - unclear type errors from `copy` options and from `Path`

- `copy("a","b",{logging: null})` gives `TypeError: cannot convert to object`, because the destructuring at `copy.ts:180-183` happens before validation.
- `Path` methods give generic messages like `new Path(42)` -> `TypeError: Expected value of type arrayOf(union(string, Path, arrayOf(union(string, Path)))), but received [42]`. `new Path(undefined)` shows `received ["<undefined>"]`. The fs functions have clear messages like `'path' argument must be either a string or a Path object`.

### 15. rough-edge - "readonly" statics can be reassigned

- Repro: `$Y -e 'Path.OS_SEGMENT_SEPARATOR = "X"; Path.OS_SEGMENT_SEPARATOR'` prints `"X"`, and the new value sticks (used as the `fromRaw` and `detectSeparator` default).
- The typings say `static readonly`.
- Cause: `path.ts:17-23`

### 16. rough-edge - string encoding edge cases are silent

- `writeFile("w.txt", "a\ud800b")` writes bytes `61 ED A0 80 62`, which is invalid UTF-8 (a lone surrogate encoded as WTF-8).
- `readFile` of invalid UTF-8 (`ff fe 00 61 62 63 c3`) returns `"��\u0000abc�"` with no warning. The docs just say "reads the file as UTF-8".

### 17. question - `extname(".bashrc")` returns `".bashrc"`

- Repro: `$Y -e '[new Path(".bashrc").extname(), extname(".bashrc"), new Path(".bashrc").extname({full:true})]'` prints all `".bashrc"`.
- Node's `path.extname(".bashrc")` returns `""`, because a leading dot marks a hidden file, not an extension. Is this intended? Either way, worth documenting.

### 18. question - Windows: separator fallback for single-segment paths

- `nice-path:135` (in `_internalConstructorAllowInvalid`, which the constructor calls) builds the separator with `detectSeparator(parts, "/")`, a hardcoded `"/"`, instead of `Path.OS_SEGMENT_SEPARATOR`. On Windows, `new Path("foo").concat("bar")` would therefore presumably be `foo/bar`.
- I can only confirm the code path here. On macOS `new Path("foo").separator` is `"/"` either way. The docs promise `OS_SEGMENT_SEPARATOR` as the default only for `fromRaw` and `detectSeparator`, so this may be intended.

### 19. question - smaller `Path` oddities

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
  - The default `"error"` for file -> file, `"skip"`, dir -> new dir given as `./name` or an absolute path (including empty subdirs), and dir -> existing dir creating `dst/src` like `cp -R`.
  - dir -> existing file errors, and a missing source errors.
  - Path arguments, unicode and spaces in names, and custom `logging.info` / `logging.trace` (trace output is detailed and useful).
  - Bad `whenTargetExists` and non-function loggers are rejected clearly.
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
  - `rename` has one test (resolving `L/../x.txt` the way the OS does). Nothing covers moving into a directory (finding 3), overwriting an existing file, or the `from`/`to` error properties.
  - `isFile`, `isExecutable`, `isReadable`, and `isWritable` have no behavior tests (only the globals listing in `globals.test.ts` / `context.test.ts`).
  - `copy` has tests for overwrite truncation, copying a file onto itself, file -> dir with the default `"error"`, merging into an existing tree, directory symlinks, copying a dir into itself, directory modes, and permission errors. All but the file-onto-itself test use absolute paths, which is how finding 1 got through. Nothing covers `whenTargetExists: "skip"`, file symlinks or dangling symlinks inside the source, what the `logging` callbacks receive, a missing source, or a dir -> existing file target.
  - `remove` has no test for a missing path.
  - `readFile` has no tests for error cases or Path arguments.
  - `writeFile` has no tests for ArrayBuffer, overwrite, or Path arguments.
  - Apart from an incidental `exists(found)` on `which`'s result in `which.test.ts`, no test passes a `Path` object to a filesystem function.
- **`meta/tests/src/path.test.ts`**
  - `relativeTo` is never called with unnormalized or mixed relative/absolute input (finding 6).
  - `dirname` is only tested on absolute paths (`dirname.test.ts` and `Path.dirname`), never on a relative or one-segment path.
  - No tests for `isAbsolute`, `concat`, `fromRaw`, `isPath`, `includes`, `OS_ENV_VAR_SEPARATOR`, `OS_PROGRAM_EXTENSIONS`, or `Path.from`.
- **`meta/tests/src/__filename-and-__dirname.test.ts`** plus the `fixture-scripts` snapshot cover only `-e` and a script importing an ESM module. Uncovered: `require()`d CJS, symlinked scripts, `.ts` files, callbacks/async, `new Function` (finding 5), and shadowing with `const`.
- **Not verified in this audit**:
  - `rename` across filesystems (EXDEV): I didn't test it, to avoid touching anything outside the sandbox. `rename.ts:27` is a bare `os.rename` with no fallback, so it presumably fails where `mv` would succeed.
  - All Windows-specific paths: drive-letter handling via `appendSlashIfWindowsDriveLetter` (which the `isReadable`/`isWritable`/`isExecutable` implementations don't call), the separator fallback (finding 18), and the `stat` path in `isDir`/`isLink` in place of `lstat`.
