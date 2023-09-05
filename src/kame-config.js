const fs = require("fs");
const path = require("path");
const { defaultResolver, Runtime, defaultLoader } = require("kame");

const stubPath = path.resolve(__dirname, "kame-module-stub.js");

exports.resolve = (id, fromFilePath) => {
  switch (id) {
    case "quickjs:os":
      return "external:quickjs:os";
    case "quickjs:std":
      return "external:quickjs:std";

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
      if (id.endsWith(".help.md")) {
        // Repoint this to a txt file that gets compiled via meta/scripts/assemble-docs.sh
        return path.resolve(
          __dirname,
          "../dist/docs",
          path.basename(id).replace(/\.help\.md$/, ".term.txt")
        );
      }

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

function loadAsString(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  return `module.exports = ${JSON.stringify(content)};`;
}

exports.load = (filename) => {
  if (filename.endsWith(".md") || filename.endsWith(".txt")) {
    return loadAsString(filename);
  } else if (filename.endsWith("?contentString")) {
    return loadAsString(filename.replace(/\?contentString$/, ""));
  } else if (filename.endsWith("?evalAtBuildTime")) {
    const modulePath = filename.replace(/\?evalAtBuildTime$/, "");

    const result = runtimeForBuildtimeEval.load(modulePath);

    return `module.exports = ${JSON.stringify(result)};`;
  } else {
    return defaultLoader.load(filename, { target: "es2020" });
  }
};
