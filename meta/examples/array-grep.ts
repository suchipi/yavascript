#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

echo(["abc", "bcd", "def", "cat"].grep(/c/i));

// non-strings are coerced to strings
echo([2, "ab2", "b2d", "def", "2at"].grep(/2/i));
