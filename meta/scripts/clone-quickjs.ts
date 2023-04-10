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

const REF = "8f0015f5f6a414fc4c3c6049db74f301de042493";

exec("git fetch origin", { cwd: "quickjs" });
exec(`git checkout ${REF}`, { cwd: "quickjs" });
