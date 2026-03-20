/*
 * QuickJS Read Eval Print Loop (modified)
 *
 * Copyright (c) 2017-2020 Fabrice Bellard
 * Copyright (c) 2017-2020 Charlie Gordon
 * Copyright (c) 2022 Lily Skye
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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

enum Direction {
  Forward = 1,
  Backward = -1,
}

enum CommandResult {
  AcceptLine = -1,
  Abort = -2,
  Exit = -3,
}

// TODO: change this to share code with the generic repl
export function startRepl(lang: string) {
  const compiler = langToCompiler(lang);
  const compileExpression = (expr: string): string => {
    const compiledCode = compiler(expr, { expression: true });
    return esmToRequire.transform(compiledCode);
  };

  /* close global objects */
  const Object = globalThis.Object;
  const String = globalThis.String;
  const Date = globalThis.Date;
  const Math = globalThis.Math;

  const colors = {
    none: "\x1b[0m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[30;1m",
    grey: "\x1b[30;1m",
    bright_red: "\x1b[31;1m",
    bright_green: "\x1b[32;1m",
    bright_yellow: "\x1b[33;1m",
    bright_blue: "\x1b[34;1m",
    bright_magenta: "\x1b[35;1m",
    bright_cyan: "\x1b[36;1m",
    bright_white: "\x1b[37;1m",
  };

  // Styles here are trying to match the styles from the builtin inspect
  // function, which itself comes from npm:@suchipi/print
  const styles = {
    default: "none",
    comment: "gray",
    string: "bright_green",
    regex: "bright_green",
    literal: "bright_magenta",
    number: "bright_magenta",
    keyword: "bright_blue",
    function: "bright_green",
    identifier: "none",
    error: "red",
    error_msg: "bright_red",
  };

  const historyFile = new HistoryFile("yavascript_repl_history.txt");

  const history = historyFile.load();
  let clip_board = "";

  let pstate = "";
  let prompt = "";
  let plen = 0;
  const ps1 = "> ";
  const ps2 = "  ... ";
  const utf8 = true;
  let show_time = false;
  const show_colors = hasColors();

  if (!show_colors) {
    for (const key of Object.keys(colors)) {
      colors[key] = "";
    }
  }

  let eval_time = 0;

  let mexpr = "";
  let level = 0;
  let cmd = "";
  let cursor_pos = 0;
  let last_cmd = "";
  let last_cursor_pos = 0;
  let history_index: number;
  let this_fun: ((...args: any) => any) | undefined;
  let last_fun: ((...args: any) => any) | undefined;
  let quote_flag = false;

  let term_fd: number;
  let term_read_buf: Uint8Array;
  let term_width: number;
  /* current X position of the cursor in the terminal */
  let term_cursor_x = 0;

  function termInit() {
    let winSize: [number, number] | null;
    term_fd = std.in.fileno();

    /* get the terminal size */
    term_width = 80;
    if (os.isatty(term_fd)) {
      if (os.ttyGetWinSize) {
        winSize = os.ttyGetWinSize(term_fd);
        if (winSize) {
          term_width = winSize[0];
        }
      }
      if (os.ttySetRaw) {
        /* set the TTY to raw mode */
        os.ttySetRaw(term_fd);
      }
    }

    /* install a Ctrl-C signal handler */
    os.signal(os.SIGINT, sigint_handler);

    /* install a handler to read stdin */
    term_read_buf = new Uint8Array(64);
    os.setReadHandler(term_fd, term_read_handler);
  }

  function sigint_handler() {
    /* send Ctrl-C to readline */
    handle_byte(3);
  }

  function term_read_handler() {
    const bytesRead = os.read(
      term_fd,
      term_read_buf.buffer as ArrayBuffer,
      0,
      term_read_buf.length,
    );
    for (let idx = 0; idx < bytesRead; idx++) {
      handle_byte(term_read_buf[idx]);
    }
  }

  let utf8_state = 0;
  let utf8_val = 0;

  function handle_byte(byte: number) {
    if (!utf8) {
      handle_char(byte);
    } else if (utf8_state !== 0 && byte >= 0x80 && byte < 0xc0) {
      utf8_val = (utf8_val << 6) | (byte & 0x3f);
      utf8_state--;
      if (utf8_state === 0) {
        handle_char(utf8_val);
      }
    } else if (byte >= 0xc0 && byte < 0xf8) {
      utf8_state = 1 + Number(byte >= 0xe0) + Number(byte >= 0xf0);
      utf8_val = byte & ((1 << (6 - utf8_state)) - 1);
    } else {
      utf8_state = 0;
      handle_char(byte);
    }
  }

  function is_alpha(char: string) {
    return (
      typeof char === "string" &&
      ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z"))
    );
  }

  function is_digit(char: string) {
    return typeof char === "string" && char >= "0" && char <= "9";
  }

  function is_word(char: string) {
    return (
      typeof char === "string" &&
      (is_alpha(char) || is_digit(char) || char == "_" || char == "$")
    );
  }

  function ucs_length(str: string) {
    let length = 0;
    const str_len = str.length;
    /* we never count the trailing surrogate to have the
         following property: ucs_length(str) =
         ucs_length(str.substring(0, a)) + ucs_length(str.substring(a,
         str.length)) for 0 <= a <= str.length */
    for (let idx = 0; idx < str_len; idx++) {
      const charCode = str.charCodeAt(idx);
      if (charCode < 0xdc00 || charCode >= 0xe000) {
        length++;
      }
    }
    return length;
  }

  function is_trailing_surrogate(char: string) {
    if (typeof char !== "string") {
      return false;
    }
    const codePoint = char.codePointAt(0);
    return codePoint != null && codePoint >= 0xdc00 && codePoint < 0xe000;
  }

  function is_balanced(open: string, close: string) {
    switch (open + close) {
      case "()":
      case "[]":
      case "{}":
        return true;
    }
    return false;
  }

  function print_color_text(str: string, start: number, style_names: string[]) {
    for (let spanEnd = start; spanEnd < str.length; ) {
      let spanStart: number;
      const style = style_names[(spanStart = spanEnd)];
      while (++spanEnd < str.length && style_names[spanEnd] == style) {
        continue;
      }
      std.puts(colors[styles[style] || "default"]);
      std.puts(str.substring(spanStart, spanEnd));
      std.puts(colors["none"]);
    }
  }

  function print_csi(count: number, code: string) {
    std.puts("\x1b[" + (count != 1 ? count : "") + code);
  }

  /* XXX: handle double-width characters */
  function move_cursor(delta: number) {
    let step: number;
    if (delta > 0) {
      while (delta != 0) {
        if (term_cursor_x == term_width - 1) {
          std.puts("\n"); /* translated to CRLF */
          term_cursor_x = 0;
          delta--;
        } else {
          step = Math.min(term_width - 1 - term_cursor_x, delta);
          print_csi(step, "C"); /* right */
          delta -= step;
          term_cursor_x += step;
        }
      }
    } else {
      delta = -delta;
      while (delta != 0) {
        if (term_cursor_x == 0) {
          print_csi(1, "A"); /* up */
          print_csi(term_width - 1, "C"); /* right */
          delta--;
          term_cursor_x = term_width - 1;
        } else {
          step = Math.min(delta, term_cursor_x);
          print_csi(step, "D"); /* left */
          delta -= step;
          term_cursor_x -= step;
        }
      }
    }
  }

  function update() {
    /* cursor_pos is the position in 16 bit characters inside the
           UTF-16 string 'cmd' */
    if (cmd != last_cmd) {
      if (
        !show_colors &&
        last_cmd.substring(0, last_cursor_pos) ==
          cmd.substring(0, last_cursor_pos)
      ) {
        /* optimize common case */
        std.puts(cmd.substring(last_cursor_pos));
      } else {
        /* goto the start of the line */
        move_cursor(-ucs_length(last_cmd.substring(0, last_cursor_pos)));
        if (show_colors) {
          const str = mexpr ? mexpr + "\n" + cmd : cmd;
          const start = str.length - cmd.length;
          const colorstate = colorize_js(str);
          print_color_text(str, start, colorstate[2]);
        } else {
          std.puts(cmd);
        }
      }
      term_cursor_x = (term_cursor_x + ucs_length(cmd)) % term_width;
      if (term_cursor_x == 0) {
        /* show the cursor on the next line */
        std.puts(" \x08");
      }
      /* remove the trailing characters */
      std.puts("\x1b[J");
      last_cmd = cmd;
      last_cursor_pos = cmd.length;
    }
    if (cursor_pos > last_cursor_pos) {
      move_cursor(ucs_length(cmd.substring(last_cursor_pos, cursor_pos)));
    } else if (cursor_pos < last_cursor_pos) {
      move_cursor(-ucs_length(cmd.substring(cursor_pos, last_cursor_pos)));
    }
    last_cursor_pos = cursor_pos;
    std.out.flush();
  }

  /* editing commands */
  function insert(str: string) {
    if (str) {
      cmd = cmd.substring(0, cursor_pos) + str + cmd.substring(cursor_pos);
      cursor_pos += str.length;
    }
  }

  function quoted_insert(_keys?: string) {
    quote_flag = true;
  }

  function abort(_keys?: string) {
    cmd = "";
    cursor_pos = 0;
    return CommandResult.Abort;
  }

  function alert(_keys?: string) {}

  function beginning_of_line(_keys?: string) {
    cursor_pos = 0;
  }

  function end_of_line(_keys?: string) {
    cursor_pos = cmd.length;
  }

  function forward_char(_keys?: string) {
    if (cursor_pos < cmd.length) {
      cursor_pos++;
      while (is_trailing_surrogate(cmd.charAt(cursor_pos))) {
        cursor_pos++;
      }
    }
  }

  function backward_char(_keys?: string) {
    if (cursor_pos > 0) {
      cursor_pos--;
      while (is_trailing_surrogate(cmd.charAt(cursor_pos))) {
        cursor_pos--;
      }
    }
  }

  function skip_word_forward(pos: number) {
    while (pos < cmd.length && !is_word(cmd.charAt(pos))) {
      pos++;
    }
    while (pos < cmd.length && is_word(cmd.charAt(pos))) {
      pos++;
    }
    return pos;
  }

  function skip_word_backward(pos: number) {
    while (pos > 0 && !is_word(cmd.charAt(pos - 1))) {
      pos--;
    }
    while (pos > 0 && is_word(cmd.charAt(pos - 1))) {
      pos--;
    }
    return pos;
  }

  function forward_word(_keys?: string) {
    cursor_pos = skip_word_forward(cursor_pos);
  }

  function backward_word(_keys?: string) {
    cursor_pos = skip_word_backward(cursor_pos);
  }

  function accept_line(_keys?: string) {
    std.puts("\n");
    history_add(cmd);
    return CommandResult.AcceptLine;
  }

  let last_history_line: string | null = null;
  function history_add(str: string) {
    if (str && str !== last_history_line) {
      history.push(str);
      historyFile.append(str);
    }
    last_history_line = str;
    history_index = history.length;
  }

  function previous_history(_keys?: string) {
    if (history_index > 0) {
      if (history_index == history.length && cmd !== "") {
        history.push(cmd);
      }
      history_index--;
      cmd = history[history_index];
      cursor_pos = cmd.length;
    }
  }

  function next_history(_keys?: string) {
    if (history_index < history.length - 1) {
      history_index++;
      cmd = history[history_index];
      cursor_pos = cmd.length;
    } else {
      cmd = "";
      cursor_pos = cmd.length;
    }
  }

  function history_search(dir: Direction) {
    const pos = cursor_pos;
    for (let i = 1; i <= history.length; i++) {
      const index = (history.length + i * dir + history_index) % history.length;
      if (history[index].substring(0, pos) == cmd.substring(0, pos)) {
        history_index = index;
        cmd = history[index];
        return;
      }
    }
  }

  function history_search_backward(_keys?: string) {
    return history_search(Direction.Backward);
  }

  function history_search_forward(_keys?: string) {
    return history_search(Direction.Forward);
  }

  function delete_char_dir(dir: Direction) {
    let start: number;
    let end: number;

    start = cursor_pos;
    if (dir < 0) {
      start--;
      while (is_trailing_surrogate(cmd.charAt(start))) {
        start--;
      }
    }
    end = start + 1;
    while (is_trailing_surrogate(cmd.charAt(end))) {
      end++;
    }

    if (start >= 0 && start < cmd.length) {
      if (last_fun === kill_region) {
        kill_region(start, end, dir);
      } else {
        cmd = cmd.substring(0, start) + cmd.substring(end);
        cursor_pos = start;
      }
    }
  }

  function delete_char(_keys?: string) {
    delete_char_dir(Direction.Forward);
  }

  function control_d(_keys?: string) {
    if (cmd.length == 0) {
      std.puts("\n");
      return CommandResult.Exit;
    } else {
      delete_char_dir(Direction.Forward);
    }
  }

  function backward_delete_char(_keys?: string) {
    delete_char_dir(Direction.Backward);
  }

  function transpose_chars(_keys?: string) {
    let pos = cursor_pos;
    if (cmd.length > 1 && pos > 0) {
      if (pos == cmd.length) {
        pos--;
      }
      cmd =
        cmd.substring(0, pos - 1) +
        cmd.substring(pos, pos + 1) +
        cmd.substring(pos - 1, pos) +
        cmd.substring(pos + 1);
      cursor_pos = pos + 1;
    }
  }

  function transpose_words(_keys?: string) {
    const word1Start = skip_word_backward(cursor_pos);
    const word1End = skip_word_forward(word1Start);
    const word2End = skip_word_forward(cursor_pos);
    const word2Start = skip_word_backward(word2End);

    if (
      word1Start < word1End &&
      word1End <= cursor_pos &&
      cursor_pos <= word2Start &&
      word2Start < word2End
    ) {
      cmd =
        cmd.substring(0, word1Start) +
        cmd.substring(word2Start, word2End) +
        cmd.substring(word1End, word2Start) +
        cmd.substring(word1Start, word1End);
      cursor_pos = word2End;
    }
  }

  function upcase_word(_keys?: string) {
    const end = skip_word_forward(cursor_pos);
    cmd =
      cmd.substring(0, cursor_pos) +
      cmd.substring(cursor_pos, end).toUpperCase() +
      cmd.substring(end);
  }

  function downcase_word(_keys?: string) {
    const end = skip_word_forward(cursor_pos);
    cmd =
      cmd.substring(0, cursor_pos) +
      cmd.substring(cursor_pos, end).toLowerCase() +
      cmd.substring(end);
  }

  function kill_region(start: number, end: number, dir: Direction) {
    const killed = cmd.substring(start, end);
    if (last_fun !== kill_region) {
      clip_board = killed;
    } else if (dir < 0) {
      clip_board = killed + clip_board;
    } else {
      clip_board = clip_board + killed;
    }

    cmd = cmd.substring(0, start) + cmd.substring(end);
    if (cursor_pos > end) {
      cursor_pos -= end - start;
    } else if (cursor_pos > start) {
      cursor_pos = start;
    }
    this_fun = kill_region;
  }

  function kill_line(_keys?: string) {
    kill_region(cursor_pos, cmd.length, Direction.Forward);
  }

  function backward_kill_line(_keys?: string) {
    kill_region(0, cursor_pos, Direction.Backward);
  }

  function kill_word(_keys?: string) {
    kill_region(cursor_pos, skip_word_forward(cursor_pos), Direction.Forward);
  }

  function backward_kill_word(_keys?: string) {
    kill_region(skip_word_backward(cursor_pos), cursor_pos, Direction.Backward);
  }

  function yank(_keys?: string) {
    insert(clip_board);
  }

  function control_c(_keys?: string) {
    if (last_fun === control_c) {
      std.puts("\n");
      cmdline.exit(0);
    } else {
      std.puts("\n(Press Ctrl-C again to quit)\n");
      readline_print_prompt();
    }
  }

  function reset(_keys?: string) {
    cmd = "";
    cursor_pos = 0;
  }

  function get_context_word(line: string, pos: number) {
    let word = "";
    while (pos > 0 && is_word(line[pos - 1])) {
      pos--;
      word = line[pos] + word;
    }
    return word;
  }
  function get_context_object(line: string, pos: number): any {
    let obj: any;
    let base: string;
    let char: string;
    if (pos <= 0 || " ~!%^&*(-+={[|:;,<>?/".indexOf(line[pos - 1]) >= 0) {
      return globalThis;
    }

    if (pos >= 2 && line[pos - 1] === ".") {
      pos--;
      obj = {};
      switch ((char = line[pos - 1])) {
        case "'":
        case '"':
          return "a";
        case "]":
          return [];
        case "}":
          return {};
        case "/":
          return / /;
        default:
          if (is_word(char)) {
            base = get_context_word(line, pos);
            if (
              ["true", "false", "null", "this"].includes(base) ||
              !isNaN(+base)
            ) {
              return eval(base);
            }
            obj = get_context_object(line, pos - base.length);
            if (obj === null || obj === void 0) {
              return obj;
            }
            if (obj === globalThis && obj[base] === void 0) {
              return eval(base);
            } else {
              return obj[base];
            }
          }
          return {};
      }
    }
    return void 0;
  }

  function get_completions(line: string, pos: number) {
    let obj: any;
    let jdx: number;

    const prefix = get_context_word(line, pos);
    const ctx_obj = get_context_object(line, pos - prefix.length);
    const results: string[] = [];
    // enumerate properties from object and its prototype chain,
    // add non-numeric regular properties with prefix as a prefix
    obj = ctx_obj;
    for (let idx = 0; idx < 10 && obj !== null && obj !== void 0; idx++) {
      const props = Object.getOwnPropertyNames(obj);
      /* add non-numeric regular properties */
      for (const prop of props) {
        if (
          typeof prop == "string" &&
          String(Number(prop)) != prop &&
          prop.startsWith(prefix)
        ) {
          results.push(prop);
        }
      }
      obj = Object.getPrototypeOf(obj);
    }
    /* sort list with internal names last and remove duplicates */
    function symcmp(left: string, right: string) {
      if (left[0] != right[0]) {
        if (left[0] == "_") {
          return 1;
        }
        if (right[0] == "_") {
          return -1;
        }
      }
      if (left < right) {
        return -1;
      }
      if (left > right) {
        return +1;
      }
      return 0;
    }
    if (results.length > 1) {
      results.sort(symcmp);
      for (let idx = (jdx = 1); idx < results.length; idx++) {
        if (results[idx] != results[idx - 1]) {
          results[jdx++] = results[idx];
        }
      }
      results.length = jdx;
    }
    /* 'tab' = list of completions, 'pos' = cursor position inside
           the completions */
    return { tab: results, pos: prefix.length, ctx: ctx_obj };
  }

  function completion(_keys?: string) {
    let candidate: string;
    let matchLen: number;
    let entry: string;
    let max_width: number;
    let n_cols: number;
    let n_rows: number;
    const res = get_completions(cmd, cursor_pos);
    const tab = res.tab;
    if (tab.length === 0) {
      return;
    }
    candidate = tab[0];
    matchLen = candidate.length;
    /* add the chars which are identical in all the completions */
    for (let idx = 1; idx < tab.length; idx++) {
      entry = tab[idx];
      for (let jdx = 0; jdx < matchLen; jdx++) {
        if (entry[jdx] !== candidate[jdx]) {
          matchLen = jdx;
          break;
        }
      }
    }
    for (let idx = res.pos; idx < matchLen; idx++) {
      insert(candidate[idx]);
    }
    if (last_fun === completion && tab.length == 1) {
      /* append parentheses to function names */
      const member = res.ctx[tab[0]];
      if (typeof member == "function") {
        insert("(");
        if (member.length == 0) {
          insert(")");
        }
      } else if (typeof member == "object") {
        insert(".");
      }
    }
    /* show the possible completions */
    if (last_fun === completion && tab.length >= 2) {
      max_width = 0;
      for (const item of tab) {
        max_width = Math.max(max_width, item.length);
      }
      max_width += 2;
      n_cols = Math.max(1, Math.floor((term_width + 1) / max_width));
      n_rows = Math.ceil(tab.length / n_cols);
      std.puts("\n");
      /* display the sorted list column-wise */
      for (let row = 0; row < n_rows; row++) {
        for (let col = 0; col < n_cols; col++) {
          const cellIdx = col * n_rows + row;
          if (cellIdx >= tab.length) {
            break;
          }
          candidate = tab[cellIdx];
          if (col != n_cols - 1) {
            candidate = candidate.padEnd(max_width);
          }
          std.puts(candidate);
        }
        std.puts("\n");
      }
      /* show a new prompt */
      readline_print_prompt();
    }
  }

  /* command table */
  const commands = {
    "\x01": beginning_of_line /* ^A - bol */,
    "\x02": backward_char /* ^B - backward-char */,
    "\x03": control_c /* ^C - abort */,
    "\x04": control_d /* ^D - delete-char or exit */,
    "\x05": end_of_line /* ^E - eol */,
    "\x06": forward_char /* ^F - forward-char */,
    "\x07": abort /* ^G - bell */,
    "\x08": backward_delete_char /* ^H - backspace */,
    "\x09": completion /* ^I - history-search-backward */,
    "\x0a": accept_line /* ^J - newline */,
    "\x0b": kill_line /* ^K - delete to end of line */,
    "\x0d": accept_line /* ^M - enter */,
    "\x0e": next_history /* ^N - down */,
    "\x10": previous_history /* ^P - up */,
    "\x11": quoted_insert /* ^Q - quoted-insert */,
    "\x12": alert /* ^R - reverse-search */,
    "\x13": alert /* ^S - search */,
    "\x14": transpose_chars /* ^T - transpose */,
    "\x17": backward_kill_word /* ^W - delete word backwards */,
    "\x18": reset /* ^X - cancel */,
    "\x19": yank /* ^Y - yank */,
    "\x1bOA": previous_history /* ^[OA - up */,
    "\x1bOB": next_history /* ^[OB - down */,
    "\x1bOC": forward_char /* ^[OC - right */,
    "\x1bOD": backward_char /* ^[OD - left */,
    "\x1bOF": forward_word /* ^[OF - ctrl-right */,
    "\x1bOH": backward_word /* ^[OH - ctrl-left */,
    "\x1b[1;5C": forward_word /* ^[[1;5C - ctrl-right */,
    "\x1b[1;5D": backward_word /* ^[[1;5D - ctrl-left */,
    "\x1b[1~": beginning_of_line /* ^[[1~ - bol */,
    "\x1b[3~": delete_char /* ^[[3~ - delete */,
    "\x1b[4~": end_of_line /* ^[[4~ - eol */,
    "\x1b[5~": history_search_backward /* ^[[5~ - page up */,
    "\x1b[6~": history_search_forward /* ^[[5~ - page down */,
    "\x1b[A": previous_history /* ^[[A - up */,
    "\x1b[B": next_history /* ^[[B - down */,
    "\x1b[C": forward_char /* ^[[C - right */,
    "\x1b[D": backward_char /* ^[[D - left */,
    "\x1b[F": end_of_line /* ^[[F - end */,
    "\x1b[H": beginning_of_line /* ^[[H - home */,
    "\x1b\x7f": backward_kill_word /* M-C-? - backward_kill_word */,
    "\x1bb": backward_word /* M-b - backward_word */,
    "\x1bd": kill_word /* M-d - kill_word */,
    "\x1bf": forward_word /* M-f - backward_word */,
    "\x1bk": backward_kill_line /* M-k - backward_kill_line */,
    "\x1bl": downcase_word /* M-l - downcase_word */,
    "\x1bt": transpose_words /* M-t - transpose_words */,
    "\x1bu": upcase_word /* M-u - upcase_word */,
    "\x7f": backward_delete_char /* ^? - delete */,
  };

  let readline_keys: string;
  let readline_state: number;
  let readline_cb: (expr: string | null) => void;

  function readline_print_prompt() {
    std.puts(prompt);
    term_cursor_x = ucs_length(prompt) % term_width;
    last_cmd = "";
    last_cursor_pos = 0;
  }

  function readline_start(defstr: string, cb: (expr: string | null) => void) {
    cmd = defstr || "";
    cursor_pos = cmd.length;
    history_index = history.length;
    readline_cb = cb;

    prompt = pstate;

    if (mexpr) {
      prompt += " ".repeat(plen - prompt.length);
      prompt += ps2;
    } else {
      if (show_time) {
        let timeStr = Math.round(eval_time) + " ";
        eval_time = 0;
        timeStr = "0".repeat(5 - timeStr.length) + timeStr;
        prompt +=
          timeStr.substring(0, timeStr.length - 4) +
          "." +
          timeStr.substring(timeStr.length - 4);
      }
      plen = prompt.length;
      prompt += ps1;
    }
    readline_print_prompt();
    update();
    readline_state = 0;
  }

  function handle_char(codePoint: number) {
    const char = String.fromCodePoint(codePoint);
    switch (readline_state) {
      case 0:
        if (char == "\x1b") {
          /* '^[' - ESC */
          readline_keys = char;
          readline_state = 1;
        } else {
          handle_key(char);
        }
        break;
      case 1 /* '^[ */:
        readline_keys += char;
        if (char == "[") {
          readline_state = 2;
        } else if (char == "O") {
          readline_state = 3;
        } else {
          handle_key(readline_keys);
          readline_state = 0;
        }
        break;
      case 2 /* '^[[' - CSI */:
        readline_keys += char;
        if (!(char == ";" || (char >= "0" && char <= "9"))) {
          handle_key(readline_keys);
          readline_state = 0;
        }
        break;
      case 3 /* '^[O' - ESC2 */:
        readline_keys += char;
        handle_key(readline_keys);
        readline_state = 0;
        break;
    }
  }

  function handle_key(keys: string) {
    let fun: ((_keys?: string) => CommandResult | void) | undefined;

    if (quote_flag) {
      if (ucs_length(keys) === 1) {
        insert(keys);
      }
      quote_flag = false;
    } else if ((fun = commands[keys])) {
      this_fun = fun;
      switch (fun(keys)) {
        case CommandResult.AcceptLine:
          readline_cb(cmd);
          return;
        case CommandResult.Abort:
          readline_cb(null);
          return;
        case CommandResult.Exit:
          /* uninstall a Ctrl-C signal handler */
          os.signal(os.SIGINT, null);
          /* uninstall the stdin read handler */
          os.setReadHandler(term_fd, null);
          return;
      }
      last_fun = this_fun;
    } else if (ucs_length(keys) === 1 && keys >= " ") {
      insert(keys);
      last_fun = insert;
    } else {
      alert(); /* beep! */
    }

    cursor_pos =
      cursor_pos < 0 ? 0 : cursor_pos > cmd.length ? cmd.length : cursor_pos;
    update();
  }

  function extract_directive(input: string) {
    if (input[0] !== "\\") {
      return "";
    }
    let pos: number;
    for (pos = 1; pos < input.length; pos++) {
      if (!is_alpha(input[pos])) {
        break;
      }
    }
    return input.substring(1, pos);
  }

  /* return true if the string after cmd can be evaluted as JS */
  function handle_directive(cmd: string, expr: string) {
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
      show_time = !show_time;
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

  function help() {
    function sel(active: boolean) {
      return active ? "*" : " ";
    }
    std.puts(
      "\\h          this help\n" +
        "\\t         " +
        sel(show_time) +
        "toggle timing display\n" +
        "\\clear      clear the terminal\n",
    );
    std.puts("\\q          exit\n");
  }

  const eval_filename =
    os.getcwd() + (os.platform === "win32" ? "\\" : "/") + "<evalScript>";

  function eval_and_print(expr: string) {
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
        filename: eval_filename,
      });
      eval_time = new Date().getTime() - now;
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
      std.puts(colors[styles.error_msg]);
      printError(error, std.out);
      std.puts(colors.none);
    }
  }

  function cmd_readline_start() {
    readline_start("    ".repeat(level), readline_handle_cmd);
  }

  function readline_handle_cmd(expr: string | null) {
    handle_cmd(expr);
    cmd_readline_start();
  }

  function handle_cmd(expr: string | null) {
    let colorstate: [string, number, Array<string>];
    let directive: string;

    if (expr === null) {
      expr = "";
      return;
    }
    if (expr === "?") {
      help();
      return;
    }
    directive = extract_directive(expr);
    if (directive.length > 0) {
      if (!handle_directive(directive, expr)) {
        return;
      }
      expr = expr.substring(directive.length + 1);
    }
    if (expr === "") {
      return;
    }

    if (mexpr) {
      expr = mexpr + "\n" + expr;
    }
    colorstate = colorize_js(expr);
    pstate = colorstate[0];
    level = colorstate[1];
    if (pstate) {
      mexpr = expr;
      return;
    }
    mexpr = "";

    eval_and_print(expr);
    level = 0;

    /* run the garbage collector after each command */
    engine.gc();
  }

  function colorize_js(str: string): [string, number, Array<string>] {
    let idx: number;
    let char: string;
    let tokenStart: number;
    const len = str.length;
    let style: string | null;
    let state = "";
    let level = 0;
    let can_regex = 1;
    const styleArray: string[] = [];

    function push_state(ch: string) {
      state += ch;
    }
    function last_state() {
      return state.substring(state.length - 1);
    }
    function pop_state() {
      const prev = last_state();
      state = state.substring(0, state.length - 1);
      return prev;
    }

    function parse_block_comment() {
      style = "comment";
      push_state("/");
      for (idx++; idx < len - 1; idx++) {
        if (str[idx] == "*" && str[idx + 1] == "/") {
          idx += 2;
          pop_state();
          break;
        }
      }
    }

    function parse_line_comment() {
      style = "comment";
      for (idx++; idx < len; idx++) {
        if (str[idx] == "\n") {
          break;
        }
      }
    }

    function parse_string(delim: string) {
      style = "string";
      push_state(delim);
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
          pop_state();
          break;
        }
      }
    }

    function parse_regex() {
      style = "regex";
      push_state("/");
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
        if (last_state() == "[") {
          if (char == "]") {
            pop_state();
          }
          // ECMA 5: ignore '/' inside char classes
          continue;
        }
        if (char == "[") {
          push_state("[");
          if (str[idx] == "[" || str[idx] == "]") {
            idx++;
          }
          continue;
        }
        if (char == "/") {
          pop_state();
          while (idx < len && is_word(str[idx])) {
            idx++;
          }
          break;
        }
      }
    }

    function parse_number() {
      style = "number";
      while (
        idx < len &&
        (is_word(str[idx]) ||
          (str[idx] == "." && (idx == len - 1 || str[idx + 1] != ".")))
      ) {
        idx++;
      }
    }

    const js_literals = "|true|false|null|undefined";

    const js_keywords =
      "|" +
      "break|case|catch|continue|debugger|default|delete|do|" +
      "else|finally|for|function|if|in|instanceof|new|" +
      "return|switch|this|throw|try|typeof|while|with|" +
      "class|const|enum|import|export|extends|super|" +
      "implements|interface|let|package|private|protected|" +
      "public|static|yield|" +
      "Infinity|NaN|" +
      "eval|arguments|" +
      "void|var|" +
      "await|";

    const js_no_regex =
      "|this|super|undefined|null|true|false|Infinity|NaN|arguments|";

    function parse_identifier() {
      can_regex = 1;

      while (idx < len && is_word(str[idx])) {
        idx++;
      }

      const delimitedWord = "|" + str.substring(tokenStart, idx) + "|";

      const isLiteral = js_literals.indexOf(delimitedWord) >= 0;
      const isKeyword = js_keywords.indexOf(delimitedWord) >= 0;

      if (isLiteral || isKeyword) {
        if (isLiteral) {
          style = "literal";
        } else if (isKeyword) {
          style = "keyword";
        }

        if (js_no_regex.indexOf(delimitedWord) >= 0) {
          can_regex = 0;
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
      can_regex = 0;
    }

    function set_style(from: number, to: number) {
      while (styleArray.length < from) {
        styleArray.push("default");
      }
      while (styleArray.length < to) {
        styleArray.push(style!);
      }
    }

    for (idx = 0; idx < len; ) {
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
          can_regex = 1;
          continue;
        case "/":
          if (idx < len && str[idx] == "*") {
            // block comment
            parse_block_comment();
            break;
          }
          if (idx < len && str[idx] == "/") {
            // line comment
            parse_line_comment();
            break;
          }
          if (can_regex) {
            parse_regex();
            can_regex = 0;
            break;
          }
          can_regex = 1;
          continue;
        case "'":
        case '"':
        case "`":
          parse_string(char);
          can_regex = 0;
          break;
        case "(":
        case "[":
        case "{":
          can_regex = 1;
          level++;
          push_state(char);
          continue;
        case ")":
        case "]":
        case "}":
          can_regex = 0;
          if (level > 0 && is_balanced(last_state(), char)) {
            level--;
            pop_state();
            continue;
          }
          style = "error";
          break;
        default:
          if (is_digit(char)) {
            parse_number();
            can_regex = 0;
            break;
          }
          if (is_word(char) || char == "$") {
            parse_identifier();
            break;
          }
          can_regex = 1;
          continue;
      }
      if (style) {
        set_style(tokenStart, idx);
      }
    }
    set_style(len, len);
    return [state, level, styleArray];
  }

  termInit();

  cmd_readline_start();
}
