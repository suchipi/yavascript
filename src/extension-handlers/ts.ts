import * as std from "std";
import compilers from "../compilers";

Module.compilers[".ts"] = (filename: string) => {
  const content = std.loadFile(filename);
  const compiled = compilers.ts(content, { filename });
  return compiled;
};
