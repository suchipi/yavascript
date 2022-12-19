// This file has an underscore at the beginning of its name so that it is at
// the top of the list in the text editor's sidebar
import { makeGetterPropertyDescriptorMap } from "../../lazy-load";

export default makeGetterPropertyDescriptorMap({
  basename: () => require("./basename"),
  cat: () => require("./cat"),
  cd: () => require("./cd"),
  chmod: () => require("./chmod"),
  dirname: () => require("./dirname"),
  echo: () => require("./echo"),
  extname: () => require("./extname"),
  ls: () => require("./ls"),
  printf: () => require("./printf"),
  pwd: () => require("./pwd"),
  readlink: () => require("./readlink"),
  realpath: () => require("./realpath"),
  touch: () => require("./touch"),
});
