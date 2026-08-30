import dedent from "string-dedent";
import * as std from "quickjs:std";
import * as os from "quickjs:os";
import * as engine from "quickjs:engine";
import * as cmdline from "quickjs:cmdline";
import printError from "../../print-error";
import * as inspectOptions from "../../inspect-options";
import { NOTHING } from "./special";
import * as esmToRequire from "../../esm-to-require";
import { langToCompiler } from "../../langs";
import { HistoryFile } from "./history-file";
import { hasColors } from "../../has-colors";
import { isAlpha } from "./text-utils";
import { colorizeJs } from "./colorize-js";
import { getCompletions } from "./js-completions";
import { makeColors, printColorText, styles } from "./js-colors";
import { startReplEngine } from "./repl-engine";

/** Printed in front of the first line of an expression. */
const FIRST_LINE_PROMPT = "> ";
/** Printed in front of each line after that, while the expression is unfinished. */
const CONTINUATION_PROMPT = "  ... ";

export function startRepl(lang: string) {
  const compiler = langToCompiler(lang);
  const compileExpression = (expr: string): string => {
    const compiledCode = compiler(expr, { expression: true });
    return esmToRequire.transform(compiledCode);
  };

  /* close global objects, so redefining them at the prompt can't break the repl */
  const Date = globalThis.Date;
  const Math = globalThis.Math;

  const showColors = hasColors();
  const colors = makeColors(showColors);

  let showTime = false;
  let evalTime = 0;
  /**
   * Width of everything the first line puts before FIRST_LINE_PROMPT, so that
   * continuation lines can be padded to line up underneath it.
   */
  let firstLinePromptWidth = 0;

  const evalFilename =
    os.getcwd() + (os.platform === "win32" ? "\\" : "/") + "<evalScript>";

  function extractDirective(input: string) {
    if (input[0] !== "\\") {
      return "";
    }
    // `\?` is the one directive whose name isn't alphabetic.
    if (input[1] === "?") {
      return "?";
    }
    let nameEnd: number;
    for (nameEnd = 1; nameEnd < input.length; nameEnd++) {
      if (!isAlpha(input[nameEnd])) {
        break;
      }
    }
    return input.substring(1, nameEnd);
  }

  function help() {
    const timingMarker = showTime ? "*" : " ";
    std.puts(
      dedent`
        \\h          this help
        \\t         ${timingMarker}toggle timing display
        \\clear      clear the terminal
        \\q          exit
      ` + "\n",
    );
  }

  /* return true if the string after cmd can be evaluted as JS */
  function handleDirective(cmd: string, expr: string) {
    if (cmd === "h" || cmd === "?" || cmd == "help") {
      help();
    } else if (cmd === "load") {
      let filename = expr.substring(cmd.length + 1).trim();
      if (filename.lastIndexOf(".") <= filename.lastIndexOf("/")) {
        filename += ".js";
      }
      engine.runScript(filename);
      return false;
    } else if (cmd === "t") {
      showTime = !showTime;
    } else if (cmd === "clear") {
      std.puts("\x1b[H\x1b[J");
    } else if (cmd === "q") {
      cmdline.exit(0);
    } else {
      std.puts("Unknown directive: " + cmd + "\n");
      return false;
    }
    return true;
  }

  function evalAndPrint(expr: string) {
    let result: any;

    try {
      const newExpr = compileExpression(expr);
      if (newExpr !== expr) {
        std.puts(colors.gray);
        std.puts(`-> ${newExpr.replace(/\s+/g, " ")}`);
        std.puts(colors.none);
        std.puts("\n");
        expr = newExpr;
      }
      const now = new Date().getTime();
      /* eval as a script */
      result = engine.evalScript(expr, {
        backtraceBarrier: true,
        filename: evalFilename,
      });
      evalTime = new Date().getTime() - now;
      std.puts(colors.none);
      if (result !== NOTHING) {
        std.puts(inspect(result, inspectOptions.forPrint()));
        std.puts(colors.none);
        std.puts("\n");
      }
      /* set the last result */
      globalThis._ = result;
    } catch (error) {
      globalThis._error = error;
      std.puts(colors[styles.errorMsg]);
      printError(error, std.out);
      std.puts(colors.none);
    }
  }

  startReplEngine({
    historyFile: new HistoryFile("yavascript_repl_history.txt"),

    handleInput(expr) {
      evalAndPrint(expr);
      /* run the garbage collector after each command */
      engine.gc();
    },

    // The colorizer doubles as the parser: an empty delimiter stack means the
    // input is balanced and ready to evaluate, and the bracket depth gives the
    // indent to prefill the next line with.
    isInputComplete(text) {
      const [state, level] = colorizeJs(text);
      return {
        complete: state === "",
        indent: "    ".repeat(level),
        promptPrefix: state,
      };
    },

    preprocessLine(line) {
      if (line === "?") {
        help();
        return null;
      }
      const directive = extractDirective(line);
      if (directive.length > 0) {
        if (!handleDirective(directive, line)) {
          return null;
        }
        return line.substring(directive.length + 1);
      }
      return line;
    },

    // Only supplied when colors are on: it makes the engine repaint the whole
    // line each keystroke, which highlighting needs but plain echo does not.
    printInput: showColors
      ? (line, pending) => {
          const str = pending ? pending + "\n" + line : line;
          const start = str.length - line.length;
          const [, , styleNames] = colorizeJs(str);
          printColorText(colors, str, start, styleNames);
        }
      : undefined,

    getCompletions,

    getPrompt({ isContinuation, promptPrefix }) {
      let prompt = promptPrefix;

      if (isContinuation) {
        // promptPrefix can be longer than the first-line prompt, making this
        // negative; the pre-TypeScript `dupstr` returned "" for that, but
        // repeat() throws.
        prompt += " ".repeat(Math.max(0, firstLinePromptWidth - prompt.length));
        return prompt + CONTINUATION_PROMPT;
      }

      if (showTime) {
        let timeStr = Math.round(evalTime) + " ";
        evalTime = 0;
        timeStr = "0".repeat(Math.max(0, 5 - timeStr.length)) + timeStr;
        prompt +=
          timeStr.substring(0, timeStr.length - 4) +
          "." +
          timeStr.substring(timeStr.length - 4);
      }
      firstLinePromptWidth = prompt.length;
      return prompt + FIRST_LINE_PROMPT;
    },
  });
}
