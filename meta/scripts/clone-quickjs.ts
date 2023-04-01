#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(Git.repoRoot(__dirname));
cd("meta");

if (!exists("quickjs")) {
  let remote = "git@github.com:suchipi/quickjs.git";
  if (env.CI) {
    remote = "https://github.com/suchipi/quickjs.git";
  }

  exec(`git clone ${remote}`);
}

const REF = "b3ae3d374c205cffc15adb52a343d3b48a313b72";

exec("git fetch origin", { cwd: "quickjs" });
exec(`git checkout ${REF}`, { cwd: "quickjs" });
