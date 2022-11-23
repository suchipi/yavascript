import compilers from "../compilers";

Module.compilers[".ts"] = (filename: string, content: string) => {
  const compiled = compilers.ts(content, { filename });
  return compiled;
};
