import * as std from "std";
import compilers from "../compilers";

Module.compilers[".jsx"] = (filename: string) => {
  const content = std.loadFile(filename);
  const compiled = compilers.jsx(content, { filename });
  return compiled;
};
