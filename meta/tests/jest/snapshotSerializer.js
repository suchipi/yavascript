const kame = require("kame");
const runtime = new kame.Runtime();
const { cleanResult } = runtime.load(require.resolve("../src/test-helpers.ts"));

const hasOwnProperty = Object.prototype.hasOwnProperty;
const cleaned = new WeakMap();

module.exports = {
  test: (val) =>
    typeof val === "object" &&
    val != null &&
    typeof val.stdout === "string" &&
    typeof val.stderr === "string" &&
    hasOwnProperty.call(val, "code") &&
    hasOwnProperty.call(val, "error") &&
    !cleaned.has(val),
  print: (val, serialize) => {
    const cleanedResult = cleanResult(val);
    cleaned.set(cleanedResult, true);
    return serialize(cleanedResult);
  },
};
