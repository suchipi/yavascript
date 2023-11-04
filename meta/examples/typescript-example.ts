#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

// YavaScript has builtin support for parsing and executing TypeScript files.

import * as std from "quickjs:std";
echo(typeof std);

function look(path: Path) {
  echo(`path: ${path}`);
  ls(path);
  exec("git status");
}

look(pwd());
