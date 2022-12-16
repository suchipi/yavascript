import * as std from "std";
import * as os from "os";
import version from "./VERSION_HARDCODED?evalAtBuildTime";
import {
  blue,
  bold,
  cyan,
  dim,
  stripAnsi,
  underline,
  yellow,
} from "../api/strings";

export default function helpTarget() {
  const bin = (text: string) => bold(blue(text));
  const opt = (text: string) => cyan(text);
  const boldOpt = (text: string) => bold(opt(text));
  const str = (text: string) => yellow(text);

  const helpText = `yavascript ${version}

${bold("Usage:")} ${bin("yavascript")} ${opt("[options]")} [file-to-run]

  ${bold("(no args)")}:          Run the REPL (read-eval-print-loop).

  ${bold("[file-to-run]")}:      Run the specified script.

  ${boldOpt("-e")} ${str("<code>")} /
  ${boldOpt("--eval")} ${str(
    "<code>"
  )}:      Evaluate a code string and print the result

  ${boldOpt("--lang")} ${str(
    "<language>"
  )}:  Set the scripting language to use. Valid values are "js",
                      "javascript", "ts", "typescript", "jsx", "tsx", "coffee",
                      or "coffeescript". If not specified, the language will be
                      inferred from the file extension. If the file has no
                      extension, the language will be inferred from its
                      contents.

  ${boldOpt("-h")} / ${boldOpt("--help")}:        Show this text

  ${boldOpt("-v")} / ${boldOpt("--version")}:     Print the version

  ${boldOpt("--license")}:          Print open-source license information

  ${boldOpt(
    "--print-types"
  )}:      Print the yavascript.d.ts file this program was
                      distributed with. This file lists all the APIs made
                      available to scripts executed with this program.

  ${boldOpt(
    "--print-src"
  )}:        Print the JavaScript code embedded in this program that
                      defines the YavaScript APIs and executes your code.

Examples:

  ${dim("# Run the repl")}
  ${bin("yavascript")}

  ${dim("# Run the repl with a specific language")}
  ${bin("yavascript")} ${opt("--lang")} ${str("'ts'")}

  ${dim("# Run a file")}
  ${bin("yavascript")} myscript.js

  ${dim("# Run a file using a specific language")}
  ${bin("yavascript")} ${opt("--lang")} ${str("'coffee'")} ./myscript

  ${dim("# Run a code string")}
  ${bin("yavascript")} ${opt("-e")} ${str("'2 + 2'")}
  ${bin("yavascript")} ${opt("--eval")} ${str("'2 + 2'")}

  ${dim("# Run a code string with a specific language")}
  ${bin("yavascript")} ${opt("-e")} ${str("'Math.floor 2.5'")} ${opt(
    "--lang"
  )} ${str("'coffee'")}
  ${bin("yavascript")} ${opt("--eval")} ${str("'Math.floor 2.5'")} ${opt(
    "--lang"
  )} ${str("'coffee'")}

  ${dim("# Print various information")}
  ${bin("yavascript")} ${opt("-v")}
  ${bin("yavascript")} ${opt("--version")}
  ${bin("yavascript")} ${opt("--license")}
  ${bin("yavascript")} ${opt("--print-types")}
  ${bin("yavascript")} ${opt("--print-src")}

For more info, see: ${cyan(
    underline("https://github.com/suchipi/yavascript/")
  )}.
`;

  if (os.isatty(std.out.fileno())) {
    std.out.puts(helpText);
  } else {
    std.out.puts(stripAnsi(helpText));
  }
}
