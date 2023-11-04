import { Module } from "quickjs:module";
import compilers from "../compilers";

Module.compilers[".jsx"] = (filename: string, content: string) => {
  const compiled = compilers.jsx(content, { filename });
  return compiled;
};
