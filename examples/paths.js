#!/usr/bin/env yavascript
/// <reference path="../yavascript.d.ts" />

echo(paths.join("/tmp", "/blaaa/"));
echo(paths.join(__dirname, "./git-stuff.js"));

echo(paths.join("C:\\something/whatever\\\\idk/lol\\"));
echo(paths.split("C:\\something/whatever\\\\idk/lol\\").join("\\"));

echo(realpath(paths.join(__dirname, "./git-stuff.js")));

echo(dirname("/tmp/hi/there.txt"));
echo(basename("/tmp/hi/there.txt"));
echo(extname("/tmp/hi/there.txt"));
