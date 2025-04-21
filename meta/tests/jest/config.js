const path = require("path");
const babelConfig = require("./babel-config");
const rootDir = require("../../root-dir");

/** @type {import('jest').Config} */
const config = {
  rootDir: rootDir(),
  setupFiles: [require.resolve("./go-to-root")],
  transform: {
    "\\.[jt]sx?$": [require.resolve("babel-jest"), babelConfig],
  },
  watchPathIgnorePatterns: ["node_modules", "<rootDir>/meta/tests/fixtures"],
  snapshotSerializers: [path.join(__dirname, "snapshotSerializer.js")],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/dist",
    "<rootDir>/meta/generated-docs/",
  ],
};

module.exports = config;
