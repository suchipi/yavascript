#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

echo(Path.join("/tmp", "/blaaa/"));
echo(Path.join(__dirname, "./git-stuff.js"));

echo(Path.join("C:\\something/whatever\\\\idk/lol\\"));
echo(Path.splitToSegments("C:\\something/whatever\\\\idk/lol\\").join("\\"));

echo(realpath(Path.join(__dirname, "./git-stuff.js")));

echo(dirname("/tmp/hi/there.txt"));
echo(basename("/tmp/hi/there.txt"));
echo(extname("/tmp/hi/there.txt"));
