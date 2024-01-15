#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

echo(new Path("/tmp", "/blaaa/"));
echo(new Path(__dirname, "./git-stuff.js"));

echo(new Path("C:\\something/whatever\\\\idk/lol\\"));
echo(Path.splitToSegments("C:\\something/whatever\\\\idk/lol\\").join("\\"));

echo(realpath(new Path(__dirname, "./git-stuff.js")));

echo(dirname("/tmp/hi/there.txt"));
echo(basename("/tmp/hi/there.txt"));
echo(extname("/tmp/hi/there.txt"));
