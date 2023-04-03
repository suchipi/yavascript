#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(GitRepo.findRoot(__dirname));

const ROOT = pwd();

const VERSION = $([
  "node",
  "-e",
  `console.log(require("./src/hardcoded/compile-time.js").version)`,
]).stdout.trim();

if (isDir("meta/tgz-release")) {
  remove("meta/tgz-release");
}
ensureDir("meta/tgz-release");
cd("meta/tgz-release");

for (const TARGET of [
  "aarch64-apple-darwin",
  "aarch64-unknown-linux-gnu",
  "aarch64-unknown-linux-musl",
  "aarch64-unknown-linux-static",
  "x86_64-apple-darwin",
  "x86_64-pc-windows-static",
  "x86_64-unknown-linux-gnu",
  "x86_64-unknown-linux-musl",
  "x86_64-unknown-linux-static",
]) {
  ensureDir(`./${TARGET}/yavascript-${VERSION}`);

  for (const path of glob(`${ROOT}/bin/${TARGET}/*`)) {
    copy(path, `./${TARGET}/yavascript-${VERSION}/`);
  }

  copy(`${ROOT}/dist/yavascript.d.ts`, `./${TARGET}/yavascript-${VERSION}/`);

  exec(
    `tar -czvf ../yavascript-${VERSION}-${TARGET}.tar.gz yavascript-${VERSION}/`,
    { cwd: TARGET }
  );
}
