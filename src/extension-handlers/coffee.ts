import * as std from "std";
import compilers from "../compilers";

Module.compilers[".coffee"] = (filename: string) => {
  const content = std.loadFile(filename);
  const compiled = compilers.coffee(content, { filename });
  return compiled;
};
