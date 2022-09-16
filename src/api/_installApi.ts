// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar

import { env } from "./env";
import { exec, $ } from "./exec";
import {
  exists,
  isDir,
  isLink,
  ls,
  readFile,
  remove,
  writeFile,
  readlink,
  ensureDir,
  copy,
} from "./filesystem";
import {
  cd,
  pwd,
  realpath,
  dirname,
  basename,
  extname,
  paths,
  get__dirname,
  get__filename,
} from "./paths";
import { glob } from "./glob";
import { is } from "./is";
import { isGitignored, repoRoot } from "./repo";
import {
  quote,
  clear,
  stripAnsi,
  bgBlack,
  bgBlue,
  bgCyan,
  bgGreen,
  bgMagenta,
  bgRed,
  bgWhite,
  bgYellow,
  black,
  blue,
  bold,
  cyan,
  dim,
  gray,
  green,
  grey,
  hidden,
  inverse,
  italic,
  magenta,
  red,
  reset,
  strikethrough,
  underline,
  white,
  yellow,
} from "./strings";
import { console, echo, print } from "./console";
import { pipe } from "./pipe";
import { bigint, boolean, number, string, symbol } from "./others";

export default function installApi(target: typeof globalThis) {
  Object.assign(target, {
    env,

    exec,
    $,

    exists,
    isDir,
    isLink,
    ls,
    readFile,
    remove,
    writeFile,
    readlink,
    ensureDir,
    copy,

    cd,
    pwd,
    realpath,
    dirname,
    basename,
    extname,
    paths,

    glob,

    is,

    isGitignored,
    repoRoot,

    quote,
    clear,
    stripAnsi,
    bgBlack,
    bgBlue,
    bgCyan,
    bgGreen,
    bgMagenta,
    bgRed,
    bgWhite,
    bgYellow,
    black,
    blue,
    bold,
    cyan,
    dim,
    gray,
    green,
    grey,
    hidden,
    inverse,
    italic,
    magenta,
    red,
    reset,
    strikethrough,
    underline,
    white,
    yellow,

    console,
    echo,
    print,

    pipe,

    bigint,
    boolean,
    number,
    string,
    symbol,
  });

  Object.defineProperties(target, {
    __filename: {
      get() {
        return get__filename(2);
      },
    },
    __dirname: {
      get() {
        return get__dirname(2);
      },
    },
  });
}
