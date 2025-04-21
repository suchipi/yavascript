import * as std from "quickjs:std";

const four = await new Promise((resolve) => resolve(4));
console.log(four, std.open);
