#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

let isWorkingTreeDirty;
try {
  exec(`git diff --quiet`);
  isWorkingTreeDirty = false;
} catch (error) {
  isWorkingTreeDirty = true;
}

const branchName = $(`git rev-parse --abbrev-ref HEAD`).stdout.trim();

const gitInfo = { branchName, isWorkingTreeDirty };
echo(gitInfo);

writeFile("git-info.yml", YAML.stringify(gitInfo));
