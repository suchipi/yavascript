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

# compile markdown docs to ANSI-escape-sequence-containing txt files
if [[ "$SKIP_GLOW" == "" ]]; then
  meta/scripts/assemble-docs.sh
fi

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
meta/scripts/assemble-dts.js

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
  PROGRAM_NAME="$1"
  TARGET="$2"
  BASE="$3"
  FILE_TO_APPEND="$4"

  if [[ $TARGET = *windows* ]]; then
    EXE=".exe"
  else
    EXE=""
  fi

  mkdir -p bin/${TARGET}
  
  cat \
    node_modules/@suchipi/quickjs/build/${TARGET}/bin/${BASE}${EXE} \
    "${FILE_TO_APPEND}" \
  > bin/${TARGET}/${PROGRAM_NAME}${EXE}

  chmod +x bin/${TARGET}/${PROGRAM_NAME}${EXE}
}

# --- x86_64 binaries ---

make_program yavascript x86_64-apple-darwin qjsbootstrap-bytecode dist/index-x86_64.bin
make_program yavascript x86_64-unknown-linux-gnu qjsbootstrap-bytecode dist/index-x86_64.bin
make_program yavascript x86_64-unknown-linux-musl qjsbootstrap-bytecode dist/index-x86_64.bin
make_program yavascript x86_64-unknown-linux-static qjsbootstrap-bytecode dist/index-x86_64.bin

# bytecode stuff wasn't working properly on windows; endianness?
make_program yavascript x86_64-pc-windows-static qjsbootstrap dist/index-x86_64.js

# --- aarch64 binaries ---

make_program yavascript aarch64-apple-darwin qjsbootstrap-bytecode dist/index-arm64.bin
make_program yavascript aarch64-unknown-linux-gnu qjsbootstrap-bytecode dist/index-arm64.bin
make_program yavascript aarch64-unknown-linux-musl qjsbootstrap-bytecode dist/index-arm64.bin
make_program yavascript aarch64-unknown-linux-static qjsbootstrap-bytecode dist/index-arm64.bin

# --- yavascript-bootstrap ---
make_program yavascript-bootstrap x86_64-apple-darwin qjsbootstrap dist/primordials-x86_64.js
make_program yavascript-bootstrap x86_64-unknown-linux-gnu qjsbootstrap dist/primordials-x86_64.js
make_program yavascript-bootstrap x86_64-unknown-linux-musl qjsbootstrap dist/primordials-x86_64.js
make_program yavascript-bootstrap x86_64-unknown-linux-static qjsbootstrap dist/primordials-x86_64.js
make_program yavascript-bootstrap x86_64-pc-windows-static qjsbootstrap dist/primordials-x86_64.js
make_program yavascript-bootstrap aarch64-apple-darwin qjsbootstrap dist/primordials-arm64.js
make_program yavascript-bootstrap aarch64-unknown-linux-gnu qjsbootstrap dist/primordials-arm64.js
make_program yavascript-bootstrap aarch64-unknown-linux-musl qjsbootstrap dist/primordials-arm64.js
make_program yavascript-bootstrap aarch64-unknown-linux-static qjsbootstrap dist/primordials-arm64.js

# copy stuff into npm folder
cp -R bin meta/npm
cp README.md meta/npm
rm -rf meta/npm/dist
mkdir -p meta/npm/dist
cp dist/index-x86_64.js meta/npm/dist
cp dist/index-arm64.js meta/npm/dist
cp dist/primordials-x86_64.js meta/npm/dist/
cp dist/primordials-arm64.js meta/npm/dist/
