const { defaultResolver } = require("kame");

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
