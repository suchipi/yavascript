const fs = require("fs");
const path = require("path");
const { defaultResolver, defaultLoader } = require("kame");

const stubPath = path.resolve(__dirname, "kame-module-stub.js");

exports.resolve = (id, fromFilePath) => {
  switch (id) {
    case "os":
      return "external:os";
    case "std":
      return "external:std";

    // intentionally unresolved; coffeescript checks for this in a try-catch,
    // and we don't want to pull it into the bundle.
    case "babel-core":
    case "@babel/core":
      return "external:" + id;

    case "fs":
    case "path":
    case "vm": {
      if (fromFilePath.startsWith("node_modules/coffeescript")) {
        // coffeescript wants some node builtins that it doesn't actually need
        // when you only use its compiler and not its eval/file-loading stuff
        return stubPath;
      }
      // intentional fallthrough
    }

    default: {
      if (id.endsWith("?contentString")) {
        return (
          defaultResolver.resolve(
            id.replace(/\?contentString$/, ""),
            fromFilePath
          ) + "?contentString"
        );
      }

      return defaultResolver.resolve(id, fromFilePath);
    }
  }
};

exports.load = (filename) => {
  if (filename.endsWith(".md")) {
    const content = fs.readFileSync(filename, "utf-8");
    return `module.exports = ${JSON.stringify(content)};`;
  } else if (filename.endsWith("?contentString")) {
    const content = fs.readFileSync(
      filename.replace(/\?contentString$/, ""),
      "utf-8"
    );
    return `module.exports = ${JSON.stringify(content)};`;
  } else {
    return defaultLoader.load(filename);
  }
};
