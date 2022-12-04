Module.compilers[".json"] = (filename: string, content: string) => {
  return "export default " + content;
};
