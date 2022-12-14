const fs = require("fs");
const path = require("path");
const { defaultResolver, defaultLoader, Runtime } = require("kame");

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

    // node builtins that we don't provide (coffeescript and others ask for
    // these but don't need them)
    case "fs":
    case "path":
    case "vm": {
      return stubPath;
    }

    // CLI-related or node-related deps of sucrase that we shouldn't need
    case "commander":
    case "glob":
    case "mz":
    case "pirates": {
      return stubPath;
    }

    case "ts-interface-checker": {
      // ts-interface-checker is Apache 2.0, but we want yavascript to be MIT.
      // So we use a stub that doesn't do any actual runtime checking.
      return path.resolve(__dirname, "kame-ts-interface-checker-stub.js");
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

      if (id.endsWith("?evalAtBuildTime")) {
        return (
          defaultResolver.resolve(
            id.replace(/\?evalAtBuildTime$/, ""),
            fromFilePath
          ) + "?evalAtBuildTime"
        );
      }

      return defaultResolver.resolve(id, fromFilePath);
    }
  }
};

const runtimeForBuildtimeEval = new Runtime();

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
  } else if (filename.endsWith("?evalAtBuildTime")) {
    const modulePath = filename.replace(/\?evalAtBuildTime$/, "");

    const result = runtimeForBuildtimeEval.load(modulePath);

    return `module.exports = ${JSON.stringify(result)};`;
  } else {
    return defaultLoader.load(filename);
  }
};
