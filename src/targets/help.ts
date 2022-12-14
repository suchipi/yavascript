import * as std from "std";
import version from "./VERSION_HARDCODED?evalAtBuildTime";

export default function helpTarget() {
  std.err.puts(`yavascript ${version}

Usage: One of these:
  yavascript
  yavascript --lang <some-language>
  yavascript <path/to/file-to-run.js>
  yavascript -e '<code-to-run>'
  yavascript --eval '<code-to-run>'
  yavascript -e '<code-to-run>' --lang <some-language>
  yavascript --eval '<code-to-run>' --lang <some-language>
  yavascript -v
  yavascript --version
  yavascript --license
  yavascript --print-types
  yavascript --print-src

Where <some-language> can be one of: "js", "javascript", "ts", "typescript",
"jsx", "tsx", "coffee", or "coffeescript".

YavaScript is a bash-like script runner which is distributed as a single
statically-linked binary. Scripts are written in JavaScript or CoffeeScript.
There are global APIs available for all the things you'd normally want to do in
a bash script, such as:

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
- Working with path strings
- Working with JSON
- Cross-file import/export using ECMAScript Modules
- Splitting strings on delimeters
- Pretty-printing of objects
- Getting the path to the currently-running script (via import.meta.url or \`__filename\`)
- Getting the absolute path to the root folder of the current git/mercurial repo (repoRoot function)

To view the APIs, consult the file yavascript.d.ts which was distributed with
this program. If you don't have that file or don't know where it is, you can
run \`yavascript --print-types > yavascript.d.ts\` to regenerate it. If you
don't have YavaScript installed, you can view the file online at
https://github.com/suchipi/yavascript/blob/main/yavascript.d.ts.

yavascript.d.ts contains TypeScript type definitions which can be given to your IDE
to assist you when writing scripts.

YavaScript is powered by a fork of the QuickJS JavaScript Engine, originally
written by Fabrice Bellard. QuickJS is a small, fast JavaScript engine
supporting the ES2020 specification.

- Original QuickJS engine: https://bellard.org/quickjs/
- The fork we use: https://github.com/suchipi/quickjs/

YavaScript is written with <3 by Lily Skye.
`);
  std.exit(2);
}
