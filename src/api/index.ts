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
  OS_PATH_SEPARATOR,
  cd,
  dirname,
  get__dirname,
  get__filename,
  makePath,
  splitPath,
  pwd,
  realpath,
  basename,
} from "./paths";
import { glob } from "./glob";
import { isGitignored, repoRoot } from "./repo";
import { inspect } from "./inspect";
import {
  quote,
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
  enabled,
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
import { console, echo } from "./console";

export function installApi(target: typeof globalThis) {
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

    OS_PATH_SEPARATOR,
    cd,
    dirname,
    makePath,
    splitPath,
    pwd,
    realpath,
    basename,

    glob,

    isGitignored,
    repoRoot,

    inspect,
    quote,
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
    enabled,
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
  });

  Object.defineProperties(target, {
    __filename: {
      get() {
        return get__filename();
      },
    },
    __dirname: {
      get() {
        return get__dirname();
      },
    },
  });
}
