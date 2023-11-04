import { Module } from "quickjs:module";
import compilers from "../compilers";

Module.compilers[".tsx"] = (filename: string, content: string) => {
  const compiled = compilers.tsx(content, { filename });
  return compiled;
};
