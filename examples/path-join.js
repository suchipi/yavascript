#!/usr/bin/env yavascript
/// <reference path="../dist/yavascript.d.ts" />

echo(pathJoin("/tmp", "/blaaa/"));
echo(pathJoin(__dirname, "./git-stuff.js"));

echo(pathJoin("C:\\something/whatever\\\\idk/lol\\", { separator: "\\" }));
