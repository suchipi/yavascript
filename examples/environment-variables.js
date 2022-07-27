#!/usr/bin/env yavascript
/// <reference path="../dist/yavascript.d.ts" />

const isCI = env.CI === "true";

echo({ isCI });
