/*
 * The line-editing engine behind both the yavascript repl and
 * `InteractivePrompt`, extracted from the QuickJS repl.
 *
 * The original QuickJS repl is subject to the following license:
 *
 * Copyright (c) 2017-2020 Fabrice Bellard
 * Copyright (c) 2017-2020 Charlie Gordon
 * Copyright (c) 2022-2026 Lily Skye
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
import * as cmdline from "quickjs:cmdline";
import { isTrailingSurrogate, isWord, ucsLength } from "./text-utils";
import type { HistoryFile } from "./history-file";

enum Direction {
  Forward = 1,
  Backward = -1,
}

enum CommandResult {
  AcceptLine = -1,
  Abort = -2,
  Exit = -3,
}

export type ReplCompletions = {
  /**
   * Whole words, sorted and deduplicated. These are what gets listed when
   * several of them match, so they are not trimmed down to the missing part.
   */
  candidates: Array<string>;
  /**
   * How many characters at the start of the candidates are already in the line,
   * immediately before the cursor. Only the rest is inserted.
   *
   * It is the caller, not the engine, that decides where a word begins, which
   * is what keeps the notion of a token out of here. A candidate given a
   * prefixLength of 0 is inserted whole, which is how a caller offers text that
   * follows a finished word rather than completing one.
   */
  prefixLength: number;
};

export type InputCompleteness = {
  /** False buffers the line and prompts for more instead of submitting. */
  complete: boolean;
  /** Prefilled text for the next continuation line. Defaults to "". */
  indent?: string;
  /** Passed to getPrompt; the JS repl uses it for the open-delimiter stack. */
  promptPrefix?: string;
};

export type ReplEngineOptions = {
  /** Called with one complete unit of input. */
  handleInput: (input: string) => void;

  /**
   * Decide whether the accumulated input is ready for `handleInput`, or whether
   * the engine should keep collecting lines. Defaults to line-at-a-time.
   */
  isInputComplete?: (text: string) => InputCompleteness;

  /**
   * Runs on each accepted line before the completeness check. Return null to
   * swallow the line entirely, e.g. because it was a directive.
   */
  preprocessLine?: (line: string) => string | null;

  /**
   * Draw the current line. `pending` holds the lines buffered so far by
   * `isInputComplete`, for callers whose rendering depends on them (a
   * colorizer needs them to know whether it is inside a string).
   *
   * When this is omitted the engine echoes typed characters incrementally.
   * Supplying it means the whole line is repainted on every keystroke, which
   * is what any highlighting needs: a character typed now can restyle
   * characters typed earlier.
   */
  printInput?: (line: string, pending: string) => void;

  /**
   * `cursorIndex` is where the cursor sits within `line`. Called on every Tab
   * press; see ReplCompletions for how the result is applied.
   */
  getCompletions?: (line: string, cursorIndex: number) => ReplCompletions;

  getPrompt?: (info: {
    isContinuation: boolean;
    promptPrefix: string;
  }) => string;

  /** When null, history is kept in memory for this session only. */
  historyFile?: HistoryFile | null;

  /** What double-Ctrl-C does. Defaults to exiting the process. */
  onQuit?: () => void;
};

export type ReplEngineHandle = {
  /** Uninstall the SIGINT handler and the stdin read handler. */
  stop(): void;
  /** Reprint the prompt and the line being edited. */
  reprompt(): void;
};

export function startReplEngine(options: ReplEngineOptions): ReplEngineHandle {
  /* close global objects, so redefining them at the prompt can't break the editor */
  const Object = globalThis.Object;
  const String = globalThis.String;
  const Math = globalThis.Math;

  const historyFile = options.historyFile ?? null;
  const isInputComplete: (text: string) => InputCompleteness =
    options.isInputComplete ?? (() => ({ complete: true }));
  const preprocessLine = options.preprocessLine ?? ((line: string) => line);
  const getPrompt = options.getPrompt ?? (() => "> ");
  const onQuit = options.onQuit ?? (() => cmdline.exit(0));

  const history: Array<string> = historyFile ? historyFile.load() : [];
  let clipBoard = "";

  /** Lines accepted so far that did not yet form a complete input. */
  let pendingInput = "";
  /** Caller-supplied prefix for the continuation prompt. */
  let promptPrefix = "";
  /** Caller-supplied prefill for the next line. */
  let indent = "";

  let prompt = "";
  const utf8 = true;

  let cmd = "";
  let cursorPos = 0;
  let lastCmd = "";
  let lastCursorPos = 0;
  let historyIndex: number;
  let thisFun: ((...args: any) => any) | undefined;
  let lastFun: ((...args: any) => any) | undefined;
  let quoteFlag = false;

  let termFd: number;
  let termReadBuf: Uint8Array;
  let termWidth: number;
  /* current X position of the cursor in the terminal */
  let termCursorX = 0;

  function termInit() {
    let winSize: [number, number] | null;
    termFd = std.in.fileno();

    /* get the terminal size */
    termWidth = 80;
    if (os.isatty(termFd)) {
      if (os.ttyGetWinSize) {
        winSize = os.ttyGetWinSize(termFd);
        if (winSize) {
          termWidth = winSize[0];
        }
      }
      if (os.ttySetRaw) {
        /* set the TTY to raw mode */
        os.ttySetRaw(termFd);
      }
    }

    /* install a Ctrl-C signal handler */
    os.signal(os.SIGINT, sigintHandler);

    /* install a handler to read stdin */
    termReadBuf = new Uint8Array(64);
    os.setReadHandler(termFd, termReadHandler);
  }

  function stop() {
    /* uninstall a Ctrl-C signal handler */
    os.signal(os.SIGINT, null);
    /* uninstall the stdin read handler */
    os.setReadHandler(termFd, null);
  }

  function sigintHandler() {
    /* send Ctrl-C to readline */
    handleByte(3);
  }

  function termReadHandler() {
    const bytesRead = os.read(
      termFd,
      termReadBuf.buffer as ArrayBuffer,
      0,
      termReadBuf.length,
    );
    for (let idx = 0; idx < bytesRead; idx++) {
      handleByte(termReadBuf[idx]);
    }
  }

  let utf8State = 0;
  let utf8Val = 0;

  function handleByte(byte: number) {
    if (!utf8) {
      handleChar(byte);
    } else if (utf8State !== 0 && byte >= 0x80 && byte < 0xc0) {
      utf8Val = (utf8Val << 6) | (byte & 0x3f);
      utf8State--;
      if (utf8State === 0) {
        handleChar(utf8Val);
      }
    } else if (byte >= 0xc0 && byte < 0xf8) {
      utf8State = 1 + Number(byte >= 0xe0) + Number(byte >= 0xf0);
      utf8Val = byte & ((1 << (6 - utf8State)) - 1);
    } else {
      utf8State = 0;
      handleChar(byte);
    }
  }

  function printCsi(count: number, code: string) {
    std.puts("\x1b[" + (count != 1 ? count : "") + code);
  }

  /* XXX: handle double-width characters */
  function moveCursor(delta: number) {
    let step: number;
    if (delta > 0) {
      while (delta != 0) {
        if (termCursorX == termWidth - 1) {
          std.puts("\n"); /* translated to CRLF */
          termCursorX = 0;
          delta--;
        } else {
          step = Math.min(termWidth - 1 - termCursorX, delta);
          printCsi(step, "C"); /* right */
          delta -= step;
          termCursorX += step;
        }
      }
    } else {
      delta = -delta;
      while (delta != 0) {
        if (termCursorX == 0) {
          printCsi(1, "A"); /* up */
          printCsi(termWidth - 1, "C"); /* right */
          delta--;
          termCursorX = termWidth - 1;
        } else {
          step = Math.min(delta, termCursorX);
          printCsi(step, "D"); /* left */
          delta -= step;
          termCursorX -= step;
        }
      }
    }
  }

  function update() {
    /* cursorPos is the position in 16 bit characters inside the
           UTF-16 string 'cmd' */
    if (cmd != lastCmd) {
      // termCursorX has to advance by what was actually written, which is only
      // the same as the whole line on the repaint path, where the cursor has
      // already been walked back to the start of the line.
      let written: string;
      if (
        !options.printInput &&
        lastCmd.substring(0, lastCursorPos) == cmd.substring(0, lastCursorPos)
      ) {
        /* optimize common case */
        written = cmd.substring(lastCursorPos);
        std.puts(written);
      } else {
        /* goto the start of the line */
        moveCursor(-ucsLength(lastCmd.substring(0, lastCursorPos)));
        if (options.printInput) {
          options.printInput(cmd, pendingInput);
        } else {
          std.puts(cmd);
        }
        written = cmd;
      }
      termCursorX = (termCursorX + ucsLength(written)) % termWidth;
      if (termCursorX == 0) {
        /* show the cursor on the next line */
        std.puts(" \x08");
      }
      /* remove the trailing characters */
      std.puts("\x1b[J");
      lastCmd = cmd;
      lastCursorPos = cmd.length;
    }
    if (cursorPos > lastCursorPos) {
      moveCursor(ucsLength(cmd.substring(lastCursorPos, cursorPos)));
    } else if (cursorPos < lastCursorPos) {
      moveCursor(-ucsLength(cmd.substring(cursorPos, lastCursorPos)));
    }
    lastCursorPos = cursorPos;
    std.out.flush();
  }

  /* editing commands */
  function insert(str: string) {
    if (str) {
      cmd = cmd.substring(0, cursorPos) + str + cmd.substring(cursorPos);
      cursorPos += str.length;
    }
  }

  function quotedInsert(_keys?: string) {
    quoteFlag = true;
  }

  function abort(_keys?: string) {
    cmd = "";
    cursorPos = 0;
    return CommandResult.Abort;
  }

  function alert(_keys?: string) {}

  function beginningOfLine(_keys?: string) {
    cursorPos = 0;
  }

  function endOfLine(_keys?: string) {
    cursorPos = cmd.length;
  }

  function forwardChar(_keys?: string) {
    if (cursorPos < cmd.length) {
      cursorPos++;
      while (isTrailingSurrogate(cmd.charAt(cursorPos))) {
        cursorPos++;
      }
    }
  }

  function backwardChar(_keys?: string) {
    if (cursorPos > 0) {
      cursorPos--;
      while (isTrailingSurrogate(cmd.charAt(cursorPos))) {
        cursorPos--;
      }
    }
  }

  /** Where the cursor lands moving one word forward from `index`. */
  function skipWordForward(index: number) {
    while (index < cmd.length && !isWord(cmd.charAt(index))) {
      index++;
    }
    while (index < cmd.length && isWord(cmd.charAt(index))) {
      index++;
    }
    return index;
  }

  /** Where the cursor lands moving one word backward from `index`. */
  function skipWordBackward(index: number) {
    while (index > 0 && !isWord(cmd.charAt(index - 1))) {
      index--;
    }
    while (index > 0 && isWord(cmd.charAt(index - 1))) {
      index--;
    }
    return index;
  }

  function forwardWord(_keys?: string) {
    cursorPos = skipWordForward(cursorPos);
  }

  function backwardWord(_keys?: string) {
    cursorPos = skipWordBackward(cursorPos);
  }

  function acceptLine(_keys?: string) {
    std.puts("\n");
    historyAdd(cmd);
    return CommandResult.AcceptLine;
  }

  let lastHistoryLine: string | null = null;
  function historyAdd(str: string) {
    if (str && str !== lastHistoryLine) {
      history.push(str);
      if (historyFile) {
        historyFile.append(str);
      }
    }
    lastHistoryLine = str;
    historyIndex = history.length;
  }

  function previousHistory(_keys?: string) {
    if (historyIndex > 0) {
      if (historyIndex == history.length && cmd !== "") {
        history.push(cmd);
      }
      historyIndex--;
      cmd = history[historyIndex];
      cursorPos = cmd.length;
    }
  }

  function nextHistory(_keys?: string) {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      cmd = history[historyIndex];
      cursorPos = cmd.length;
    } else {
      cmd = "";
      cursorPos = cmd.length;
    }
  }

  /** Jump to the nearest history entry starting with what's typed so far. */
  function historySearch(dir: Direction) {
    const prefixLength = cursorPos;
    for (let i = 1; i <= history.length; i++) {
      const index = (history.length + i * dir + historyIndex) % history.length;
      if (
        history[index].substring(0, prefixLength) ==
        cmd.substring(0, prefixLength)
      ) {
        historyIndex = index;
        cmd = history[index];
        return;
      }
    }
  }

  function historySearchBackward(_keys?: string) {
    return historySearch(Direction.Backward);
  }

  function historySearchForward(_keys?: string) {
    return historySearch(Direction.Forward);
  }

  function deleteCharDir(dir: Direction) {
    let start: number;
    let end: number;

    start = cursorPos;
    if (dir < 0) {
      start--;
      while (isTrailingSurrogate(cmd.charAt(start))) {
        start--;
      }
    }
    end = start + 1;
    while (isTrailingSurrogate(cmd.charAt(end))) {
      end++;
    }

    if (start >= 0 && start < cmd.length) {
      if (lastFun === killRegion) {
        killRegion(start, end, dir);
      } else {
        cmd = cmd.substring(0, start) + cmd.substring(end);
        cursorPos = start;
      }
    }
  }

  function deleteChar(_keys?: string) {
    deleteCharDir(Direction.Forward);
  }

  function controlD(_keys?: string) {
    if (cmd.length == 0) {
      std.puts("\n");
      return CommandResult.Exit;
    } else {
      deleteCharDir(Direction.Forward);
    }

    return undefined;
  }

  function backwardDeleteChar(_keys?: string) {
    deleteCharDir(Direction.Backward);
  }

  function transposeChars(_keys?: string) {
    // index of the right-hand character of the pair being swapped
    let rightIndex = cursorPos;
    if (cmd.length > 1 && rightIndex > 0) {
      if (rightIndex == cmd.length) {
        rightIndex--;
      }
      cmd =
        cmd.substring(0, rightIndex - 1) +
        cmd.substring(rightIndex, rightIndex + 1) +
        cmd.substring(rightIndex - 1, rightIndex) +
        cmd.substring(rightIndex + 1);
      cursorPos = rightIndex + 1;
    }
  }

  function transposeWords(_keys?: string) {
    const word1Start = skipWordBackward(cursorPos);
    const word1End = skipWordForward(word1Start);
    const word2End = skipWordForward(cursorPos);
    const word2Start = skipWordBackward(word2End);

    if (
      word1Start < word1End &&
      word1End <= cursorPos &&
      cursorPos <= word2Start &&
      word2Start < word2End
    ) {
      cmd =
        cmd.substring(0, word1Start) +
        cmd.substring(word2Start, word2End) +
        cmd.substring(word1End, word2Start) +
        cmd.substring(word1Start, word1End) +
        cmd.substring(word2End);
      cursorPos = word2End;
    }
  }

  function upcaseWord(_keys?: string) {
    const end = skipWordForward(cursorPos);
    cmd =
      cmd.substring(0, cursorPos) +
      cmd.substring(cursorPos, end).toUpperCase() +
      cmd.substring(end);
  }

  function downcaseWord(_keys?: string) {
    const end = skipWordForward(cursorPos);
    cmd =
      cmd.substring(0, cursorPos) +
      cmd.substring(cursorPos, end).toLowerCase() +
      cmd.substring(end);
  }

  function killRegion(start: number, end: number, dir: Direction) {
    const killed = cmd.substring(start, end);
    if (lastFun !== killRegion) {
      clipBoard = killed;
    } else if (dir < 0) {
      clipBoard = killed + clipBoard;
    } else {
      clipBoard = clipBoard + killed;
    }

    cmd = cmd.substring(0, start) + cmd.substring(end);
    if (cursorPos > end) {
      cursorPos -= end - start;
    } else if (cursorPos > start) {
      cursorPos = start;
    }
    thisFun = killRegion;
  }

  function killLine(_keys?: string) {
    killRegion(cursorPos, cmd.length, Direction.Forward);
  }

  function backwardKillLine(_keys?: string) {
    killRegion(0, cursorPos, Direction.Backward);
  }

  function killWord(_keys?: string) {
    killRegion(cursorPos, skipWordForward(cursorPos), Direction.Forward);
  }

  function backwardKillWord(_keys?: string) {
    killRegion(skipWordBackward(cursorPos), cursorPos, Direction.Backward);
  }

  function yank(_keys?: string) {
    insert(clipBoard);
  }

  function controlC(_keys?: string) {
    if (lastFun === controlC) {
      std.puts("\n");
      onQuit();
    } else {
      std.puts("\n(Press Ctrl-C again to quit)\n");
      readlinePrintPrompt();
    }
  }

  function reset(_keys?: string) {
    cmd = "";
    cursorPos = 0;
  }

  function completion(_keys?: string) {
    if (!options.getCompletions) {
      return;
    }

    let candidate: string;
    let matchLen: number;
    let entry: string;
    let maxWidth: number;
    let nCols: number;
    let nRows: number;
    const isRepeatedTab = lastFun === completion;
    const res = options.getCompletions(cmd, cursorPos);
    const tab = res.candidates;
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
    for (let idx = res.prefixLength; idx < matchLen; idx++) {
      insert(candidate[idx]);
    }
    /* show the possible completions */
    if (isRepeatedTab && tab.length >= 2) {
      maxWidth = 0;
      for (const item of tab) {
        maxWidth = Math.max(maxWidth, item.length);
      }
      maxWidth += 2;
      nCols = Math.max(1, Math.floor((termWidth + 1) / maxWidth));
      nRows = Math.ceil(tab.length / nCols);
      std.puts("\n");
      /* display the sorted list column-wise */
      for (let row = 0; row < nRows; row++) {
        for (let col = 0; col < nCols; col++) {
          const cellIdx = col * nRows + row;
          if (cellIdx >= tab.length) {
            break;
          }
          candidate = tab[cellIdx];
          if (col != nCols - 1) {
            candidate = candidate.padEnd(maxWidth);
          }
          std.puts(candidate);
        }
        std.puts("\n");
      }
      /* show a new prompt */
      readlinePrintPrompt();
    }
  }

  /* command table */
  const commands = {
    "\x01": beginningOfLine /* ^A - bol */,
    "\x02": backwardChar /* ^B - backward-char */,
    "\x03": controlC /* ^C - abort */,
    "\x04": controlD /* ^D - delete-char or exit */,
    "\x05": endOfLine /* ^E - eol */,
    "\x06": forwardChar /* ^F - forward-char */,
    "\x07": abort /* ^G - bell */,
    "\x08": backwardDeleteChar /* ^H - backspace */,
    "\x09": completion /* ^I - tab */,
    "\x0a": acceptLine /* ^J - newline */,
    "\x0b": killLine /* ^K - delete to end of line */,
    "\x0d": acceptLine /* ^M - enter */,
    "\x0e": nextHistory /* ^N - down */,
    "\x10": previousHistory /* ^P - up */,
    "\x11": quotedInsert /* ^Q - quoted-insert */,
    "\x12": alert /* ^R - reverse-search */,
    "\x13": alert /* ^S - search */,
    "\x14": transposeChars /* ^T - transpose */,
    "\x17": backwardKillWord /* ^W - delete word backwards */,
    "\x18": reset /* ^X - cancel */,
    "\x19": yank /* ^Y - yank */,
    "\x1bOA": previousHistory /* ^[OA - up */,
    "\x1bOB": nextHistory /* ^[OB - down */,
    "\x1bOC": forwardChar /* ^[OC - right */,
    "\x1bOD": backwardChar /* ^[OD - left */,
    "\x1bOF": endOfLine /* ^[OF - end */,
    "\x1bOH": beginningOfLine /* ^[OH - home */,
    "\x1b[1;5C": forwardWord /* ^[[1;5C - ctrl-right */,
    "\x1b[1;5D": backwardWord /* ^[[1;5D - ctrl-left */,
    "\x1b[1~": beginningOfLine /* ^[[1~ - bol */,
    "\x1b[3~": deleteChar /* ^[[3~ - delete */,
    "\x1b[4~": endOfLine /* ^[[4~ - eol */,
    "\x1b[5~": historySearchBackward /* ^[[5~ - page up */,
    "\x1b[6~": historySearchForward /* ^[[5~ - page down */,
    "\x1b[A": previousHistory /* ^[[A - up */,
    "\x1b[B": nextHistory /* ^[[B - down */,
    "\x1b[C": forwardChar /* ^[[C - right */,
    "\x1b[D": backwardChar /* ^[[D - left */,
    "\x1b[F": endOfLine /* ^[[F - end */,
    "\x1b[H": beginningOfLine /* ^[[H - home */,
    "\x1b\x7f": backwardKillWord /* M-C-? - backwardKillWord */,
    "\x1bb": backwardWord /* M-b - backwardWord */,
    "\x1bd": killWord /* M-d - killWord */,
    "\x1bf": forwardWord /* M-f - backwardWord */,
    "\x1bk": backwardKillLine /* M-k - backwardKillLine */,
    "\x1bl": downcaseWord /* M-l - downcaseWord */,
    "\x1bt": transposeWords /* M-t - transposeWords */,
    "\x1bu": upcaseWord /* M-u - upcaseWord */,
    "\x7f": backwardDeleteChar /* ^? - delete */,
  };

  let readlineKeys: string;
  let readlineState: number;
  let readlineCb: (expr: string | null) => void;

  function readlinePrintPrompt() {
    std.puts(prompt);
    termCursorX = ucsLength(prompt) % termWidth;
    lastCmd = "";
    lastCursorPos = 0;
  }

  function readlineStart(defstr: string, cb: (expr: string | null) => void) {
    cmd = defstr || "";
    cursorPos = cmd.length;
    historyIndex = history.length;
    readlineCb = cb;

    // Built once per line rather than on every reprint: getPrompt is allowed to
    // have side effects (the JS repl consumes its eval timer here).
    prompt = getPrompt({
      isContinuation: pendingInput !== "",
      promptPrefix,
    });

    readlinePrintPrompt();
    update();
    readlineState = 0;
  }

  function handleChar(codePoint: number) {
    const char = String.fromCodePoint(codePoint);
    switch (readlineState) {
      case 0:
        if (char == "\x1b") {
          /* '^[' - ESC */
          readlineKeys = char;
          readlineState = 1;
        } else {
          handleKey(char);
        }
        break;
      case 1 /* '^[ */:
        readlineKeys += char;
        if (char == "[") {
          readlineState = 2;
        } else if (char == "O") {
          readlineState = 3;
        } else {
          handleKey(readlineKeys);
          readlineState = 0;
        }
        break;
      case 2 /* '^[[' - CSI */:
        readlineKeys += char;
        if (!(char == ";" || (char >= "0" && char <= "9"))) {
          handleKey(readlineKeys);
          readlineState = 0;
        }
        break;
      case 3 /* '^[O' - ESC2 */:
        readlineKeys += char;
        handleKey(readlineKeys);
        readlineState = 0;
        break;
    }
  }

  function handleKey(keys: string) {
    let fun: ((_keys?: string) => CommandResult | void) | undefined;

    // Every path has to record what it did: controlC, killRegion and
    // completion all decide what to do by comparing against lastFun, so a path
    // that leaves it untouched makes the *next* keypress act like a repeat of
    // whatever came before this one.
    if (quoteFlag) {
      if (ucsLength(keys) === 1) {
        insert(keys);
      }
      quoteFlag = false;
      lastFun = insert;
    } else if ((fun = commands[keys])) {
      thisFun = fun;
      const result = fun(keys);
      // killRegion reassigns thisFun, so read it back after the call.
      lastFun = thisFun;
      switch (result) {
        case CommandResult.AcceptLine:
          readlineCb(cmd);
          return;
        case CommandResult.Abort:
          readlineCb(null);
          return;
        case CommandResult.Exit:
          stop();
          return;
      }
    } else if (ucsLength(keys) === 1 && keys >= " ") {
      insert(keys);
      lastFun = insert;
    } else {
      alert(); /* beep! */
      lastFun = alert;
    }

    cursorPos =
      cursorPos < 0 ? 0 : cursorPos > cmd.length ? cmd.length : cursorPos;
    update();
  }

  function cmdReadlineStart() {
    readlineStart(indent, readlineHandleCmd);
  }

  function readlineHandleCmd(line: string | null) {
    handleAcceptedLine(line);
    cmdReadlineStart();
  }

  function handleAcceptedLine(line: string | null) {
    // An aborted line (^G) is dropped, but any buffered multiline input and
    // its prompt survive, so the user can keep going where they left off.
    if (line === null) {
      return;
    }

    const processed = preprocessLine(line);
    if (processed == null || processed === "") {
      return;
    }

    const text = pendingInput ? pendingInput + "\n" + processed : processed;
    const status = isInputComplete(text);
    promptPrefix = status.promptPrefix ?? "";
    indent = status.indent ?? "";

    if (!status.complete) {
      pendingInput = text;
      return;
    }

    pendingInput = "";
    indent = "";
    options.handleInput(text);
  }

  termInit();
  cmdReadlineStart();

  return {
    stop,
    reprompt() {
      readlinePrintPrompt();
      update();
    },
  };
}
