import * as std from "std";
import version from "./VERSION_HARDCODED?evalAtBuildTime";

export default function helpTarget() {
  std.err.puts(`yavascript ${version}

Usage: yavascript [options] [file-to-run]

  (no options):       Run the REPL (read-eval-print-loop).

  [file-to-run]:      Run the specified script.

  -e <code> /
  --eval <code>:      Evaluate a code string and print the result

  --lang <language>:  Set the scripting language to use. Valid values are "js",
                      "javascript", "ts", "typescript", "jsx", "tsx", "coffee",
                      or "coffeescript". If not specified, the language will be
                      inferred from the file extension. If the file has no
                      extension, the language will be inferred from its
                      contents.

  -h / --help:        Show this text

  -v / --version:     Print the version

  --license:          Print open-source license information

  --print-types:      Print the yavascript.d.ts file this program was
                      distributed with. This file lists all the APIs made
                      available to scripts executed with this program.

  --print-src:        Print the JavaScript code embedded in this program that
                      defines the YavaScript APIs and executes your code.

Examples:

  # Run the repl
  yavascript

  # Run the repl with a specific language
  yavascript --lang 'ts'

  # Run a file
  yavascript myscript.js

  # Run a file using a specific language
  yavascript --lang 'coffee' ./myscript

  # Run a code string
  yavascript -e '2 + 2'
  yavascript --eval '2 + 2'

  # Run a code string with a specific language
  yavascript -e 'Math.floor 2.5' --lang 'coffee'
  yavascript --eval 'Math.floor 2.5' --lang 'coffee'

  # Print various information
  yavascript -v
  yavascript --version
  yavascript --license
  yavascript --print-types
  yavascript --print-src

For more info, see: https://github.com/suchipi/yavascript/
`);
}
