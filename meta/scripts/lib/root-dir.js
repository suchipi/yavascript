const path = require("node:path");
const { pathMarker } = require("path-less-traveled");

const rootDir = pathMarker(path.resolve(__dirname, "../../.."));

module.exports = rootDir;
