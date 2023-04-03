#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

exec(["git", "status"]);

let branchName = $(["git", "rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();

echo({ branchName });

const repoRoot = GitRepo.findRoot(__dirname);
echo(repoRoot);

const yavascriptRepo = new GitRepo(repoRoot);

// relative paths are resolved relative to pwd
echo(GitRepo.findRoot("../quickjs"));
cd(__dirname);
echo(GitRepo.findRoot("../quickjs"));
