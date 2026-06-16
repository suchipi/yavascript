import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[".js"] = (filename: string, content: string) => {
  const compiled = compilers.js(content, { filename });
  return compiled;
};
// import attribute version
ModuleDelegate.compilers["javascript"] = ModuleDelegate.compilers[".js"];
