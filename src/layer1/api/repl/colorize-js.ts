/*
 * The JavaScript tokenizer/colorizer from the modified QuickJS repl
 * (see repl-engine.ts for the full license).
 */

import { isDigit, isWord } from "./text-utils";

function isBalanced(open: string, close: string) {
  switch (open + close) {
    case "()":
    case "[]":
    case "{}":
      return true;
  }
  return false;
}

/**
 * Tokenize `str` as JavaScript.
 *
 * Returns `[state, level, styleArray]`, where `state` is the stack of
 * still-open delimiters (empty when the input is a complete expression),
 * `level` is the bracket nesting depth, and `styleArray` holds a style name per
 * character of `str`.
 */
export function colorizeJs(str: string): [string, number, Array<string>] {
  let idx: number;
  let char: string;
  let tokenStart: number;
  const len = str.length;
  let style: string | null;
  let state = "";
  let level = 0;
  let canRegex = 1;
  const styleArray: string[] = [];

  function pushState(ch: string) {
    state += ch;
  }
  function lastState() {
    return state.substring(state.length - 1);
  }
  function popState() {
    const prev = lastState();
    state = state.substring(0, state.length - 1);
    return prev;
  }

  function parseBlockComment() {
    style = "comment";
    pushState("/");
    for (idx++; idx < len - 1; idx++) {
      if (str[idx] == "*" && str[idx + 1] == "/") {
        idx += 2;
        popState();
        break;
      }
    }
  }

  function parseLineComment() {
    style = "comment";
    for (idx++; idx < len; idx++) {
      if (str[idx] == "\n") {
        break;
      }
    }
  }

  function parseString(delim: string) {
    style = "string";
    pushState(delim);
    while (idx < len) {
      char = str[idx++];
      if (char == "\n") {
        style = "error";
        continue;
      }
      if (char == "\\") {
        if (idx >= len) {
          break;
        }
        idx++;
      } else if (char == delim) {
        popState();
        break;
      }
    }
  }

  function parseRegex() {
    style = "regex";
    pushState("/");
    while (idx < len) {
      char = str[idx++];
      if (char == "\n") {
        style = "error";
        continue;
      }
      if (char == "\\") {
        if (idx < len) {
          idx++;
        }
        continue;
      }
      if (lastState() == "[") {
        if (char == "]") {
          popState();
        }
        // ECMA 5: ignore '/' inside char classes
        continue;
      }
      if (char == "[") {
        pushState("[");
        if (str[idx] == "[" || str[idx] == "]") {
          idx++;
        }
        continue;
      }
      if (char == "/") {
        popState();
        while (idx < len && isWord(str[idx])) {
          idx++;
        }
        break;
      }
    }
  }

  function parseNumber() {
    style = "number";
    while (
      idx < len &&
      (isWord(str[idx]) ||
        (str[idx] == "." && (idx == len - 1 || str[idx + 1] != ".")))
    ) {
      idx++;
    }
  }

  const jsLiterals = new Set(["true", "false", "null", "undefined"]);

  const jsKeywords = new Set(
    // prettier-ignore
    [
      "break", "case", "catch", "continue", "debugger", "default", "delete",
      "do", "else", "finally", "for", "function", "if", "in", "instanceof",
      "new", "return", "switch", "this", "throw", "try", "typeof", "while",
      "with", "class", "const", "enum", "import", "export", "extends", "super",
      "implements", "interface", "let", "package", "private", "protected",
      "public", "static", "yield", "Infinity", "NaN", "eval", "arguments",
      "void", "var", "await",
    ],
  );

  // A regex can't follow any of these, so a slash after one is division.
  const jsNoRegex = new Set(
    // prettier-ignore
    [
      "this", "super", "undefined", "null", "true", "false", "Infinity", "NaN",
      "arguments",
    ],
  );

  function parseIdentifier() {
    canRegex = 1;

    while (idx < len && isWord(str[idx])) {
      idx++;
    }

    const word = str.substring(tokenStart, idx);

    const isLiteral = jsLiterals.has(word);
    const isKeyword = jsKeywords.has(word);

    if (isLiteral || isKeyword) {
      style = isLiteral ? "literal" : "keyword";

      if (jsNoRegex.has(word)) {
        canRegex = 0;
      }
      return;
    }

    let lookahead = idx;
    while (lookahead < len && str[lookahead] == " ") {
      lookahead++;
    }

    if (lookahead < len && str[lookahead] == "(") {
      style = "function";
      return;
    }

    style = "identifier";
    canRegex = 0;
  }

  function setStyle(from: number, to: number) {
    while (styleArray.length < from) {
      styleArray.push("default");
    }
    while (styleArray.length < to) {
      styleArray.push(style!);
    }
  }

  for (idx = 0; idx < len;) {
    style = null;
    tokenStart = idx;
    switch ((char = str[idx++])) {
      case " ":
      case "\t":
      case "\r":
      case "\n":
        continue;
      case "+":
      case "-":
        if (idx < len && str[idx] == char) {
          idx++;
          continue;
        }
        canRegex = 1;
        continue;
      case "/":
        if (idx < len && str[idx] == "*") {
          // block comment
          parseBlockComment();
          break;
        }
        if (idx < len && str[idx] == "/") {
          // line comment
          parseLineComment();
          break;
        }
        if (canRegex) {
          parseRegex();
          canRegex = 0;
          break;
        }
        canRegex = 1;
        continue;
      case "'":
      case '"':
      case "`":
        parseString(char);
        canRegex = 0;
        break;
      case "(":
      case "[":
      case "{":
        canRegex = 1;
        level++;
        pushState(char);
        continue;
      case ")":
      case "]":
      case "}":
        canRegex = 0;
        if (level > 0 && isBalanced(lastState(), char)) {
          level--;
          popState();
          continue;
        }
        style = "error";
        break;
      default:
        if (isDigit(char)) {
          parseNumber();
          canRegex = 0;
          break;
        }
        if (isWord(char) || char == "$") {
          parseIdentifier();
          break;
        }
        canRegex = 1;
        continue;
    }
    if (style) {
      setStyle(tokenStart, idx);
    }
  }
  setStyle(len, len);
  return [state, level, styleArray];
}
