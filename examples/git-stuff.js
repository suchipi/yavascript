#!/usr/bin/env yavascript
/// <reference path="../dist/yavascript.d.ts" />

exec(["git", "status"]);

let branchName = $(["git", "rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();

echo({ branchName });

echo(repoRoot());
echo(repoRoot(__dirname));
echo(repoRoot("../quickjs"));
