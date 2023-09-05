# yavascript

YavaScript is a cross-platform bash-like script runner and repl which is distributed as a single
statically-linked binary. Scripts can be written in JavaScript, TypeScript, JSX/TSX, or CoffeeScript.

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

To view the APIs, consult the file yavascript.d.ts which was distributed with
this program, or online at https://github.com/suchipi/yavascript/blob/main/yavascript.d.ts.
This file contains TypeScript type definitions which can be given to your IDE
to assist you when writing scripts, even if you aren't writing your scripts in TypeScript.

Here's an example of a script using YavaScript:

```js
#!/usr/bin/env yavascript

// This comment is optional; it tells VS Code to load the specified TypeScript definitions.
/// <reference path="./yavascript.d.ts" />

let isWorkingTreeDirty;
try {
  exec(`git diff --quiet`);
  isWorkingTreeDirty = false;
} catch (error) {
  isWorkingTreeDirty = true;
}

const branchName = $(`git rev-parse --abbrev-ref HEAD`).stdout.trim();

const gitInfo = { branchName, isWorkingTreeDirty };
echo(gitInfo);

writeFile("git-info.yml", YAML.stringify(gitInfo));
```

YavaScript is powered by a fork of the QuickJS JavaScript Engine, originally
written by Fabrice Bellard. QuickJS is a small, fast JavaScript engine
supporting the ES2020 specification.

- Original QuickJS engine: https://bellard.org/quickjs/
- The fork we use: https://github.com/suchipi/quickjs/

## Compiling

You'll need to install these prerequisites:

- [node.js](https://nodejs.org/en)
- [ninja](https://ninja-build.org/)
- [bat](https://github.com/sharkdp/bat)

Then run `meta/build.sh` to build binaries for the current platform (will be output in `dist`), or `meta/build-all.sh` to build binaries for all platforms (will be output in `bin`).

### Building the Docker image

You will need docker installed. After building binaries for all platforms, ensure yavascript is in your PATH, then run `meta/docker/build-image.sh`.

---

YavaScript is written with <3 by Lily Skye.
