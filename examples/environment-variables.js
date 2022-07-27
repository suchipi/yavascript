#!/usr/bin/env yavascript
/// <reference path="../dist/yavascript.d.ts" />

echo(env);

const isCI = "CI" in env;

echo({ isCI });
