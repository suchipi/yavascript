import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[".ts"] = (filename: string, content: string) => {
  const compiled = compilers.ts(content, { filename });
  return compiled;
};
