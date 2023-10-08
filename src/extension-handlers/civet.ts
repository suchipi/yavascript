import compilers from "../compilers";

Module.compilers[".civet"] = (filename: string, content: string) => {
  const compiled = compilers.civet(content, { filename });
  return compiled;
};
