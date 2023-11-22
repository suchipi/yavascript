import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[".civet"] = (filename: string, content: string) => {
  const compiled = compilers.civet(content, { filename });
  return compiled;
};
