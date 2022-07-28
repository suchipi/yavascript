import * as std from "std";
import "./console-patch";
import "./api";
import * as pkg from "../package.json";

if (scriptArgs.length < 2) {
  std.err.puts(
    `Please specify a file to run. For example: ${scriptArgs[0]} ./my-script.js\nFor more info, run ${scriptArgs[0]} --help.`
  );
  std.exit(1);
}

const targetFile = scriptArgs[1];

if (targetFile === "-h" || targetFile === "--help") {
  std.err.puts(`yavascript ${pkg.version}

Usage: ${scriptArgs[0]} <path/to/file.js>

YavaScript is a bash-like script runner which is distributed as a single
statically-linked binary. Scripts are written in JavaScript. There are global
APIs available for all the things you'd normally want to do in a bash script,
such as:

- Running programs
- Accessing environment variables
- Reading and writing file contents
- Checking if files/folders exist
- Removing files/folders
- Reading and changing the current working directory
- Using globs to get large lists of files
- Printing stylized text to the terminal

Additionally, since it's JavaScript, you get some other features that are
either not present in bash or are cumbersome to use in bash, namely:

- Arrays (lists) and Objects (key/value dictionaries)
- Working with JSON
- Splitting strings on delimeters
- Pretty-printing of objects
- Cross-file import/export using ECMAScript Modules
- Getting the path to the currently-running script (via import.meta.url)

To view the APIs, consult the file yavascript.d.ts which was distributed
with this program. This file contains TypeScript type definitions which can be
given to your IDE to assist you when writing scripts.

YavaScript is powered by a fork of the QuickJS JavaScript Engine, originally
written by Fabrice Bellard. QuickJS is a small, fast JavaScript engine
supporting the ES2020 specification.

- Original QuickJS engine: https://bellard.org/quickjs/
- The fork we use: https://github.com/suchipi/quickjs/

YavaScript is written with <3 by Lily Scott.
`);
  std.exit(2);
}

std.importModule(targetFile, "./<cwd>");
