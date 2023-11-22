import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[".coffee"] = (filename: string, content: string) => {
  const compiled = compilers.coffee(content, { filename });
  return compiled;
};
