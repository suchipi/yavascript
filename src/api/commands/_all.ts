// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar
import { makeGetterPropertyDescriptorMap } from "../../lazy-load";

export default makeGetterPropertyDescriptorMap({
  basename: () =>
    (require("./basename") as typeof import("./basename")).basename,
  cat: () => (require("./cat") as typeof import("./cat")).cat,
  cd: () => (require("./cd") as typeof import("./cd")).cd,
  chmod: () => (require("./chmod") as typeof import("./chmod")).chmod,
  dirname: () => (require("./dirname") as typeof import("./dirname")).dirname,
  echo: () => (require("./echo") as typeof import("./echo")).echo,
  exit: () => (require("./exit") as typeof import("./exit")).exit,
  extname: () => (require("./extname") as typeof import("./extname")).extname,
  ls: () => (require("./ls") as typeof import("./ls")).ls,
  mkdir: () => (require("./mkdir") as typeof import("./mkdir")).mkdir,
  mkdirp: () => (require("./mkdir") as typeof import("./mkdir")).mkdirp,
  printf: () => (require("./printf") as typeof import("./printf")).printf,
  pwd: () => (require("./pwd") as typeof import("./pwd")).pwd,
  readlink: () =>
    (require("./readlink") as typeof import("./readlink")).readlink,
  realpath: () =>
    (require("./realpath") as typeof import("./realpath")).realpath,
  sleep: () => (require("./sleep") as typeof import("./sleep")).sleep,
  touch: () => (require("./touch") as typeof import("./touch")).touch,
  which: () => (require("./which") as typeof import("./which")).which,
});
