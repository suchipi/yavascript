import lib from "./lib-cjs.js";
import * as ns from "./lib-cjs.js";
import esmDefault from "./esm-with-default-mentioning-cjs.js";

const dynamic = await import("./lib-cjs.js");

console.log(
  JSON.stringify({
    lib,
    nsDefault: ns.default,
    dynamicDefault: dynamic.default,
    esmDefault,
  }),
);
