#!/usr/bin/env yavascript
/// <reference path="../yavascript.d.ts" />

// YavaScript has builtin support for parsing and executing TypeScript files.

import * as std from "std";
echo(typeof std, std instanceof Module);

function look(path: string) {
  echo(`path: ${path}`);
  ls(path);
  exec("git status");
}

look(pwd());
