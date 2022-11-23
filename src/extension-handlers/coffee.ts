import compilers from "../compilers";

Module.compilers[".coffee"] = (filename: string, content: string) => {
  const compiled = compilers.coffee(content, { filename });
  return compiled;
};
