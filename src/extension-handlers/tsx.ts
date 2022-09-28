import * as std from "std";
import compilers from "../compilers";

Module.compilers[".tsx"] = (filename: string) => {
  const content = std.loadFile(filename);
  const compiled = compilers.tsx(content, { filename });
  return compiled;
};
