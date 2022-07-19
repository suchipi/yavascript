/// <reference path="./dist/tonna.d.ts" />

console.log(glob(pwd(), ["!**/node_modules", "!**/.git"]));
