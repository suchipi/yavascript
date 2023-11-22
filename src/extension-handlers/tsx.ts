import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[".tsx"] = (filename: string, content: string) => {
  const compiled = compilers.tsx(content, { filename });
  return compiled;
};
