import { Module } from "quickjs:module";
import compilers from "../compilers";

Module.compilers[""] = (filename: string, content: string) => {
  return compilers.autodetect(content, { filename });
};
