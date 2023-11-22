import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[".js"] = (filename: string, content: string) => {
  const compiled = compilers.js(content, { filename });
  return compiled;
};
