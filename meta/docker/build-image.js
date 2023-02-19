#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(__dirname);

copy("../../bin/linux-amd64/yavascript", "./yavascript", {
  whenTargetExists: "overwrite",
});
// TODO: copy doesn't preserve permissions
// Also TODO: chmod treats missing u/g/o in object as "none". Should be "existing" instead
// also, need to have some way of saying "add execute but don't touch read/write"
chmod({ user: "rwx", group: "rx", others: "rx" }, "./yavascript");

ensureDir("empty");

exec("docker build -t suchipi/yavascript:latest .");
