#!/usr/bin/env yavascript
/// <reference path="../dist/yavascript.d.ts" />
import "./lib/set-rootdir.js";

cd("npm");
exec(["cp", "-R", "../bin", "."]);
exec(["cp", "../dist/yavascript.d.ts", "."]);
