#!/bin/bash

set -ex

ROOT=$(realpath .)

mkdir -p meta/tgz-release
cd meta/tgz-release

VERSION=`cat ${ROOT}/package.json | jq -r .version`

rm -rf ./*

for TARGET in \
  darwin-arm64 \
  darwin-x86_64 \
  linux-amd64 \
  linux-aarch64 \
  windows-x86_64 \
; do
  if [[ $TARGET = win* ]]; then
    EXE=".exe"
  else
    EXE=""
  fi

  mkdir -p ./${TARGET}/yavascript-${VERSION}/

  cp ${ROOT}/bin/${TARGET}/* ./${TARGET}/yavascript-${VERSION}/
  cp ${ROOT}/dist/yavascript.d.ts ./${TARGET}/yavascript-${VERSION}/

  pushd "${TARGET}" > /dev/null
  tar -czvf yavascript-${VERSION}-${TARGET}.tar.gz yavascript-${VERSION}/
  popd > /dev/null
done
