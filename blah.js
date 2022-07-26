#!/usr/bin/env yavascript
/// <reference path="./dist/yavascript.d.ts" />

console.log(glob(pwd(), ["!**/node_modules", "!**/.git"]));
