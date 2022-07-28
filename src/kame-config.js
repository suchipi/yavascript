const fs = require("fs");
const { defaultResolver, defaultLoader } = require("kame");

exports.resolve = (id, fromFilePath) => {
  switch (id) {
    case "os":
      return "external:os";
    case "std":
      return "external:std";
    default: {
      return defaultResolver.resolve(id, fromFilePath);
    }
  }
};

exports.load = (filename) => {
  if (filename.endsWith(".md")) {
    const content =  fs.readFileSync(filename, "utf-8");
    return `module.exports = ${JSON.stringify(content)};`;
  } else {
    return defaultLoader.load(filename);
  }
}
