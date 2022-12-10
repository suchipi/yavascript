#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

echo(env);

const isCI = "CI" in env;

echo({ isCI });
