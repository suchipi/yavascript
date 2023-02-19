#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

exec(["git", "status"]);

let branchName = $(["git", "rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();

echo({ branchName });

echo(Git.repoRoot());
echo(Git.repoRoot(__dirname));
echo(Git.repoRoot("../quickjs"));
cd(__dirname);
echo(Git.repoRoot("../quickjs"));
