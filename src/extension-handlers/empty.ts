import compilers from "../compilers";

Module.compilers[""] = (filename: string, content: string) => {
  try {
    return compilers.jsx(content, { filename });
  } catch (err) {
    try {
      return compilers.tsx(content, { filename });
    } catch (err2) {
      try {
        return compilers.coffee(content, { filename });
      } catch (err3) {
        return content;
      }
    }
  }
};
