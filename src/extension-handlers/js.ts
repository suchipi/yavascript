import compilers from "../compilers";

Module.compilers[".js"] = (filename: string, content: string) => {
  const compiled = compilers.js(content, { filename });
  return compiled;
};
