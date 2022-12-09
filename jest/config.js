const path = require("path");
const babelConfig = require("./babel-config");

/** @type {import('jest').Config} */
const config = {
  transform: {
    "\\.[jt]sx?$": ["babel-jest", babelConfig],
  },
  watchPathIgnorePatterns: ["node_modules", "test_fixtures"],
  snapshotSerializers: [path.join(__dirname, "snapshotSerializer.js")],
};

module.exports = config;
