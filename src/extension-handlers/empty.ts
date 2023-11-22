import { ModuleDelegate } from "quickjs:engine";
import compilers from "../compilers";

ModuleDelegate.compilers[""] = (filename: string, content: string) => {
  return compilers.autodetect(content, { filename });
};
