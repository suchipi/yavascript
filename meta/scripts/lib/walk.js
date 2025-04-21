const path = require("path");
const { walk } = require("resolve-everything");
const rootDir = require("../../root-dir");

// walk the JS/TS import/require graph, starting at the given entrypoint,
// and return all the files that were part of it. It only goes one-file-deep
// into node_modules.
function walkJsDeps(entrypoint, { useKameResolver = false } = {}) {
  const entrypointAbs = path.isAbsolute(entrypoint)
    ? entrypoint
    : rootDir(entrypoint);

  const walkOptions = {
    skip: /node_modules/g,
  };
  if (useKameResolver) {
    walkOptions.resolver = require("../../../src/kame-config").resolve;
  }

  const { errors, modules } = walk(entrypointAbs, walkOptions);

  if (errors.length > 0) {
    throw Object.assign(new Error("module traversal errors occurred"), {
      errors,
    });
  }

  return Array.from(modules.keys()).map((filename) => {
    // our kame resolver adds "query params" to the end of filenames sometimes
    const withoutTrailingQueryParam = filename.replace(/\?.*$/, "");
    // these don't strictly-speaking need to be relative paths, but it makes
    // the build.ninja file easier to read
    return rootDir.relative(withoutTrailingQueryParam);
  });
}

module.exports = { walkJsDeps };
