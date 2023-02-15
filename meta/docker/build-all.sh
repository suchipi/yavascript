#!/usr/bin/env bash
set -ex

# Move to repo root
cd $(git rev-parse --show-toplevel)

meta/scripts/clone-quickjs.sh

# build quickjs (dep of yavascript)
if [[ "$SKIP_QJS" == "" ]]; then
  pushd meta/quickjs > /dev/null
  meta/docker/build-all.sh
  popd > /dev/null
fi

if [[ "$(uname)" == "Darwin" ]]; then
# Don't do uid/gid remapping in macOS, as Docker Desktop does its own
# uid/gid mapping from root to the normal user
in_docker() {
  docker run --rm -v $PWD:/opt/yavascript -w "/opt/yavascript" $@
}
else
# But *do* do it on Linux, where they're probably not using Docker Desktop
in_docker() {
  docker run --rm -v $PWD:/opt/yavascript -w "/opt/yavascript" --user "$(id -u):$(id -g)" $@
}
fi

NODE_VERSION_WITH_V="$(cat .node-version)"
NODE_VERSION="${NODE_VERSION_WITH_V/v/}"

# grab JS dependencies from npm
in_docker node:${NODE_VERSION} npm install

rm -rf dist
mkdir -p dist

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
in_docker node:${NODE_VERSION} meta/scripts/assemble-dts.sh

# generate dist/index-*.js (bundles in dependencies from npm)
in_docker node:${NODE_VERSION} env YAVASCRIPT_ARCH=arm64 npm run bundle -- --output dist/index-arm64.js
in_docker node:${NODE_VERSION} env YAVASCRIPT_ARCH=x86_64 npm run bundle -- --output dist/index-x86_64.js

# compile dist/index-*.js to bytecode
cp dist/index-arm64.js yavascript-internal.js # to have clearer filename in stack traces
in_docker node:${NODE_VERSION} meta/quickjs/build/linux-amd64/bin/qjs \
  meta/scripts/to-bytecode.mjs \
  yavascript-internal.js \
  dist/index-arm64.bin
cp dist/index-x86_64.js yavascript-internal.js # to have clearer filename in stack traces
in_docker node:${NODE_VERSION} meta/quickjs/build/linux-amd64/bin/qjs \
  meta/scripts/to-bytecode.mjs \
  yavascript-internal.js \
  dist/index-x86_64.bin

mkdir -p bin

function make_program() {
  TARGET="$1"
  BYTECODE_FILE="$2"

  if [[ $TARGET = win* ]]; then
    EXE=".exe"
  else
    EXE=""
  fi

  mkdir -p bin/${TARGET}
  
  cat \
    meta/quickjs/build/${TARGET}/bin/qjsbootstrap-bytecode${EXE} \
    "${BYTECODE_FILE}" \
  > bin/${TARGET}/yavascript${EXE}

  chmod +x bin/${TARGET}/yavascript${EXE}
}

for TARGET in \
  darwin-x86_64 \
  linux-amd64 \
  windows-x86_64 \
; do
  make_program "$TARGET" dist/index-x86_64.bin
done

for TARGET in \
  darwin-arm64 \
  linux-aarch64 \
; do
  make_program "$TARGET" dist/index-arm64.bin
done

# copy stuff into npm folder
cp -R bin meta/npm
cp README.md meta/npm
