#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(GitRepo.findRoot(__dirname));
cd("meta");

if (!exists("quickjs")) {
  let remote = "git@github.com:suchipi/quickjs.git";
  if (env.CI) {
    remote = "https://github.com/suchipi/quickjs.git";
  }

  exec(`git clone ${remote}`);
}

const REF = "27a08c6fb82b46090f31d3311d1d018873f6ba14";

exec("git fetch origin", { cwd: "quickjs" });
exec(`git checkout ${REF}`, { cwd: "quickjs" });
