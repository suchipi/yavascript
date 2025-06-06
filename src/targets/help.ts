import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { version, arch } from "../hardcoded";
import {
  blue,
  bold,
  cyan,
  dim,
  stripAnsi,
  underline,
  yellow,
} from "../api/strings";
import { hasColors } from "../has-colors";

export default function helpTarget() {
  const bin = (text: string) => bold(blue(text));
  const opt = (text: string) => cyan(text);
  const boldOpt = (text: string) => bold(opt(text));
  const str = (text: string) => yellow(text);

  const helpText = `yavascript ${version} (${arch})

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
                      "coffeescript", or "civet". If not specified, the
                      language will be inferred from the file extension. If the
                      file has no extension, the language will be inferred from
                      its contents.

  ${boldOpt("-r")} ${str("<file>")} /
  ${boldOpt("--require")} ${str(
    "<file>"
  )}:   File to preload; this file will be loaded prior to
                      performing other actions, such as the repl, eval, or
                      loading a file normally. This flag can be specified more
                      than once to specify more than one file to preload.

  ${boldOpt("-h")} / ${boldOpt("--help")}:        Show this text

  ${boldOpt("-v")} / ${boldOpt("--version")}:     Print the version

  ${boldOpt("--license")}:          Print open-source license information

  ${boldOpt(
    "--print-types"
  )}:      Print the yavascript.d.ts file this program was
                      distributed with. This file lists all the APIs made
                      available to scripts executed with this program.

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

  ${dim("# Run one file, then run another")}
  ${bin("yavascript")} ${opt("-r")} first.ts second.js
  ${bin("yavascript")} ${opt("--require")} first.ts second.js

  ${dim("# Run three files")}
  ${bin("yavascript")} ${opt("-r")} first.ts ${opt("-r")} second.js third.coffee
  ${bin("yavascript")} ${opt("--require")} first.ts ${opt(
    "--require"
  )} second.js third.coffee

  ${dim("# Print various information")}
  ${bin("yavascript")} ${opt("-v")}
  ${bin("yavascript")} ${opt("--version")}
  ${bin("yavascript")} ${opt("--license")}
  ${bin("yavascript")} ${opt("--print-types")}

For more info, see: ${cyan(
    underline("https://github.com/suchipi/yavascript/")
  )}.
`;

  if (hasColors()) {
    std.out.puts(helpText);
  } else {
    std.out.puts(stripAnsi(helpText));
  }
}
