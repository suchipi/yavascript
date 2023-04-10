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

const REF = "90e54332ab1da0a52cf394d07b893e601943bd9b";

exec("git fetch origin", { cwd: "quickjs" });
exec(`git checkout ${REF}`, { cwd: "quickjs" });
