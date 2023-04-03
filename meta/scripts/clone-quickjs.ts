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

const REF = "e3b92d7bff289b9f6ea1afc9c6c8d9ec7ad8c7dd";

exec("git fetch origin", { cwd: "quickjs" });
exec(`git checkout ${REF}`, { cwd: "quickjs" });
