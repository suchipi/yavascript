# yavascript

YavaScript is a cross-platform bash-like script runner and repl which is distributed as a single
statically-linked binary. Scripts can be written in [JavaScript](https://en.wikipedia.org/wiki/JavaScript), [TypeScript](https://www.typescriptlang.org/), [JSX/TSX](https://react.dev/learn/writing-markup-with-jsx), [CoffeeScript](https://coffeescript.org/) or [Civet](https://civet.dev/).

There are APIs available for all the things you'd normally want to do in
a bash script, such as:

- Running programs and getting their stdout/stderr/status
- Reading/writing environment variables
- Checking if files/folders exist
- Removing/creating/copying files/folders
- Reading and changing the current working directory
- Reading and resolving symbolic links
- Using globs to get large lists of files
- Printing stylized text
- Clearing the terminal
- Fetching files from the internet

Additionally, you can do other things that are either not present in bash or are cumbersome to use in bash, namely:

- Serialize and deserialize JSON, CSV, and YAML
- Removing ANSI control characters from a string
- Split path strings into a list of segments and rejoin them into a string
- Check if a path is absolute and resolve relative paths
- Parse command-line flags
- Work with Arrays (lists)
- Work with Objects (key/value dictionaries)
- Work with Typed Arrays (byte buffers)
- Reliably get the path to the currently-running file
- Strongly-typed interfaces and functions (via TypeScript)
- Cross-file import/export using ECMAScript Modules
- Split strings on delimeters
- Pretty-print complex structures
- Call low-level POSIX C APIs like fputs, sprintf, isatty
- Perform work in threads
- Import packages from npm (via "npm:" imports) or local node_modules

You'll also find analogues to familiar CLI tools, like:

- dirname
- basename
- cat
- ls
- realpath
- readlink

...and more.

## APIs

To view the APIs online:

- An overview is available [here](/meta/generated-docs/README.md)
- Or you can view [the `.d.ts` file](./yavascript.d.ts), if you prefer.

Or, if you already have YavaScript installed:

- Run `help()` from the REPL
- Use `yavascript --print-types` to obtain the `.d.ts` file for your release

The `.d.ts` file contains documented TypeScript type definitions which can be given to your IDE to assist you when writing scripts, even if you aren't writing your scripts in TypeScript.

YavaScript's `help()` function can be used in YavaScript's interactive repl to read formatted markdown documentation offline in your terminal.

## Example

Here's an example of a script using YavaScript:

```js
#!/usr/bin/env yavascript

// This <reference> comment is optional; it tells VS Code to load the
// specified TypeScript definitions, which it can use for Intellisense,
// linting, and autocomplete, even if you aren't using TypeScript.
/// <reference path="./yavascript.d.ts" />

// Searches upwards from this file to find the root of the Git repository
const repoRoot = GitRepo.findRoot(__dirname);
// or, one could use hardcoded location relative to this file:
// const repoRoot = new Path(__dirname, "../..");

cd(repoRoot);

// Check if there are changes to the repo
const diffResult = exec("git diff --quiet", { failOnNonZeroStatus: false });
const isWorkingTreeDirty = diffResult.status !== 0;

// If there are, check whether .js files in lib/ have a matching .d.ts file.
if (isWorkingTreeDirty) {
  const jsFiles = glob("lib/**/*.js");
  for (const filePath of jsFiles) {
    const dtsFilePath = filePath.replaceLast(
      filePath.basename().replace(/\.js$/, ".d.ts")
    );
    if (!exists(dtsFilePath)) {
      const displayPath = quote(dtsFilePath.relativeTo(repoRoot));
      let message = `Expected ${displayPath} to exist, but it didn't. Please add .d.ts files for all .js files under 'lib/'.`;

      // ANSI escape sequence helpers
      message = bold(yellow(message));

      // Writes to stderr
      console.error(messsage);
    }
  }
}

// Prepare some info for a deployment automation tool...
const branchName = $(`git rev-parse --abbrev-ref HEAD`).stdout.trim();
const gitInfo = { branchName, isWorkingTreeDirty };

// `echo` and `print` are aliases for `console.log`, for discoverability. All
// three support any number of arguments, which don't have to be strings.
echo(gitInfo);

// YAML.stringify works like JSON.stringify. We also have CSV and TOML!
writeFile("git-info.yml", YAML.stringify(gitInfo));

// Need something lower-level? Use builtin POSIX APIs from QuickJS.
import * as std from "quickjs:std";
import * as os from "quickjs:os";

console.log(`Finished at ${std.strftime(64, "%Y-%m-%dT%H:%M:%S", Date.now())}`);
console.log(os.lstat(".gitignore").size);
console.log("Is tty?", os.isatty(std.in));
```

## QuickJS

YavaScript is powered by a fork of the QuickJS JavaScript Engine, originally
written by Fabrice Bellard. QuickJS is a small, fast JavaScript engine
supporting the ES2020 specification.

- Original QuickJS engine: https://bellard.org/quickjs/
- The fork we use: https://github.com/suchipi/quickjs/

## Installation

You can find the binary for your platform on [the releases page](https://github.com/suchipi/yavascript/releases). As YavaScript is fully self-contained in one small file, it's trivial to install and uninstall; simply place it somewhere specified in your [`PATH`](https://superuser.com/a/284351). Supported platforms are:

- macOS 10.16 or higher, either Intel or Apple Silicon (M1, M2, etc)
- Linux (gnu), either aarch64 or x86_64
- Linux (musl), either aarch64 or x86_64
- Linux (with musl libc statically linked into the binary), either aarch64 or x86_64
- Windows (MinGW), x86_64

## Compiling

You'll need to install these prerequisites:

- [Node.js](https://nodejs.org/en)
- [Ninja](https://ninja-build.org/)
- [bat](https://github.com/sharkdp/bat) (for syntax-highlighting code blocks in help markdown)

Then run `meta/build.sh`. The compiled output will be in the `dist` folder:

- `dist/yavascript`: The binary for your platform
- `dist/bin/*`: Binaries for all supported platforms
- Other files in `dist/`: Intermediate build artifacts

### Building the Docker image

You will need docker installed. After building binaries for all platforms, ensure yavascript is in your PATH, then run `meta/docker/build-image.sh`.

---

YavaScript is written with <3 by Lily Skye.
