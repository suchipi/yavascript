/*
 * The repl's syntax-highlighting palette, extracted from the modified QuickJS
 * repl (see repl-engine.ts for the full license).
 *
 * Copyright (c) 2017-2020 Fabrice Bellard
 * Copyright (c) 2017-2020 Charlie Gordon
 * Copyright (c) 2022-2026 Lily Skye
 */

import * as std from "quickjs:std";

export type Colors = { [name: string]: string };

const ANSI_COLORS: Colors = {
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
  brightRed: "\x1b[31;1m",
  brightGreen: "\x1b[32;1m",
  brightYellow: "\x1b[33;1m",
  brightBlue: "\x1b[34;1m",
  brightMagenta: "\x1b[35;1m",
  brightCyan: "\x1b[36;1m",
  brightWhite: "\x1b[37;1m",
};

// Styles here are trying to match the styles from the builtin inspect
// function, which itself comes from npm:@suchipi/print
export const styles: { [styleName: string]: string } = {
  default: "none",
  comment: "gray",
  string: "brightGreen",
  regex: "brightGreen",
  literal: "brightMagenta",
  number: "brightMagenta",
  keyword: "brightBlue",
  function: "brightGreen",
  identifier: "none",
  error: "red",
  errorMsg: "brightRed",
};

/**
 * The palette to write with. When `enabled` is false every entry is the empty
 * string, so the same code paths run with or without color and emit no escape
 * sequences.
 */
export function makeColors(enabled: boolean): Colors {
  if (enabled) {
    return { ...ANSI_COLORS };
  }

  const blank: Colors = {};
  for (const key of Object.keys(ANSI_COLORS)) {
    blank[key] = "";
  }
  return blank;
}

/**
 * Write `str` from `start` onwards, coloring each character according to the
 * style named at the same index of `styleNames`.
 */
export function printColorText(
  colors: Colors,
  str: string,
  start: number,
  styleNames: Array<string>,
) {
  for (let spanEnd = start; spanEnd < str.length;) {
    let spanStart: number;
    const style = styleNames[(spanStart = spanEnd)];
    while (++spanEnd < str.length && styleNames[spanEnd] == style) {
      continue;
    }
    std.puts(colors[styles[style] || "default"]);
    std.puts(str.substring(spanStart, spanEnd));
    std.puts(colors["none"]);
  }
}
