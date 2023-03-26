#!/bin/bash

set -ex

ROOT=$(realpath .)

VERSION=$(node -e 'r = new (require("kame").Runtime)(); console.log(r.load("./src/hardcoded/compile-time.ts").version)')

mkdir -p meta/tgz-release
cd meta/tgz-release

rm -rf ./*

for TARGET in \
  aarch64-apple-darwin \
  aarch64-unknown-linux-gnu \
  aarch64-unknown-linux-musl \
  aarch64-unknown-linux-static \
  x86_64-apple-darwin \
  x86_64-pc-windows-static \
  x86_64-unknown-linux-gnu \
  x86_64-unknown-linux-musl \
  x86_64-unknown-linux-static \
; do
  mkdir -p ./${TARGET}/yavascript-${VERSION}/

  cp ${ROOT}/bin/${TARGET}/* ./${TARGET}/yavascript-${VERSION}/
  cp ${ROOT}/dist/yavascript.d.ts ./${TARGET}/yavascript-${VERSION}/

  pushd "${TARGET}" > /dev/null
  tar -czvf ../yavascript-${VERSION}-${TARGET}.tar.gz yavascript-${VERSION}/
  popd > /dev/null
done
