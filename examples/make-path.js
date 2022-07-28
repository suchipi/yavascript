#!/usr/bin/env yavascript
/// <reference path="../dist/yavascript.d.ts" />

echo(makePath("/tmp", "/blaaa/"));
echo(makePath(__dirname, "./git-stuff.js"));

echo(makePath("C:\\something/whatever\\\\idk/lol\\"));
echo(makePath("C:\\something/whatever\\\\idk/lol\\", { separator: "\\" }));

echo(realpath(makePath(__dirname, "./git-stuff.js")));
