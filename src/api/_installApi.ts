// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar

import {
  basename,
  cat,
  cd,
  chmod,
  dirname,
  echo,
  extname,
  ls,
  printf,
  pwd,
  readlink,
  realpath,
} from "./commands/_all";
import * as stubs from "./commands/_stubs";
import { env } from "./env";
import { exec, $ } from "./exec";
import {
  exists,
  isDir,
  isLink,
  readFile,
  remove,
  writeFile,
  ensureDir,
  copy,
} from "./filesystem";
import { paths } from "./paths";
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
import { console, print } from "./console";
import { pipe } from "./pipe";
import { bigint, boolean, number, string, symbol } from "./others";
import { JSX } from "./jsx";
import { CSV } from "./csv";
import { YAML } from "./yaml";
import traceAll from "./traceAll";
import { get__filename, get__dirname } from "./__filename-and-__dirname";
import parseScriptArgs from "./parse-script-args";
import { startRepl } from "./start-repl";
import { process } from "./node-compat";

export default function installApi(target: typeof globalThis) {
  Object.assign(target, {
    cat,
    echo,
    ls,
    readlink,
    printf,

    env,

    exec,
    $,

    exists,
    isDir,
    isLink,
    readFile,
    remove,
    writeFile,
    ensureDir,
    copy,
    chmod,

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
    print,

    pipe,

    bigint,
    boolean,
    number,
    string,
    symbol,

    JSX,
    CSV,
    YAML,

    traceAll,
    parseScriptArgs,
    startRepl,

    process,
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

  for (const [name, stub] of Object.entries(stubs)) {
    Object.defineProperty(target, name, {
      enumerable: false,
      configurable: true,
      get() {
        return stub();
      },
    });
  }
}
