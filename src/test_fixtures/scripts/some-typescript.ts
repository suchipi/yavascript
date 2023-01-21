#!/usr/bin/env yavascript
/// <reference path="../../../yavascript.d.ts" />

declare var something: any;
echo(typeof something);

import * as std from "quickjs:std";
echo(typeof std, std instanceof Module);

function look(path: string) {
  echo(`path: ${path}`);
  echo(realpath(path));
}

look(pwd());
