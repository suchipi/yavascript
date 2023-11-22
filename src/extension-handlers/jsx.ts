import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[".jsx"] = (filename: string, content: string) => {
  const compiled = compilers.jsx(content, { filename });
  return compiled;
};
