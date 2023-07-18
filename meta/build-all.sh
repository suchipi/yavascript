#!/usr/bin/env bash
set -ex

# build yavascript for all supported platforms. for release

# Move to repo root
cd $(git rev-parse --show-toplevel)

# Use node 18
if [[ "$SKIP_FNM_USE" == "" ]]; then
  fnm use
fi

# grab JS dependencies from npm
if [[ "$SKIP_NPM_INSTALL" == "" ]]; then
  npm install
fi

rm -rf dist
mkdir -p dist

# compile markdown docs to ANSI-escape-sequence-containing txt files using Glow (https://github.com/charmbracelet/glow)
if [[ "$SKIP_GLOW" == "" ]]; then
  meta/scripts/assemble-docs.sh
fi

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
bin/yavascript meta/scripts/assemble-dts.ts

# generate dist/index-*.js (bundles in dependencies from npm)
env YAVASCRIPT_ARCH=arm64 npm run bundle -- --output dist/index-arm64.js
env YAVASCRIPT_ARCH=x86_64 npm run bundle -- --output dist/index-x86_64.js
env YAVASCRIPT_ARCH=arm64 npm run bundle:primordials -- --output dist/primordials-arm64.js
env YAVASCRIPT_ARCH=x86_64 npm run bundle:primordials -- --output dist/primordials-x86_64.js

# compile dist/index-*.js to bytecode
cp dist/index-arm64.js yavascript-internal.js # to have clearer filename in stack traces
npx --no-install qjs \
  meta/scripts/to-bytecode.mjs \
  yavascript-internal.js \
  dist/index-arm64.bin

cp dist/index-x86_64.js yavascript-internal.js # to have clearer filename in stack traces
npx --no-install qjs \
  meta/scripts/to-bytecode.mjs \
  yavascript-internal.js \
  dist/index-x86_64.bin

mkdir -p bin

function make_program() {
  TARGET="$1"
  BYTECODE_FILE="$2"

  if [[ $TARGET = *windows* ]]; then
    EXE=".exe"
  else
    EXE=""
  fi

  mkdir -p bin/${TARGET}
  
  cat \
    node_modules/@suchipi/quickjs/build/${TARGET}/bin/qjsbootstrap-bytecode${EXE} \
    "${BYTECODE_FILE}" \
  > bin/${TARGET}/yavascript${EXE}

  chmod +x bin/${TARGET}/yavascript${EXE}
}

for TARGET in \
  x86_64-apple-darwin \
  x86_64-unknown-linux-gnu \
  x86_64-unknown-linux-musl \
  x86_64-unknown-linux-static \
  x86_64-pc-windows-static \
; do
  make_program "$TARGET" dist/index-x86_64.bin
done

for TARGET in \
  aarch64-apple-darwin \
  aarch64-unknown-linux-gnu \
  aarch64-unknown-linux-musl \
  aarch64-unknown-linux-static \
; do
  make_program "$TARGET" dist/index-arm64.bin
done

# copy stuff into npm folder
cp -R bin meta/npm
cp README.md meta/npm
