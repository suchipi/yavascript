import compilers from "../compilers";

Module.compilers[""] = (filename: string, content: string) => {
  return compilers.autodetect(content, { filename });
};
