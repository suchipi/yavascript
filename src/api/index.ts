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
import { isGitignored, repoRoot } from "./repo";
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

    cd,
    pwd,
    realpath,
    dirname,
    basename,
    extname,
    paths,

    glob,

    isGitignored,
    repoRoot,

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
