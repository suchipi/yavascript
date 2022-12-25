#!/usr/bin/env bash
set -ex

# faster (but less guaranteed to work) build script, for quick iteration.
# only works on linux/darwin, and you need all the stuff from the docker
# containers installed on the host machine (notably: node, gcc, ninja).

# Move to repo root
cd $(git rev-parse --show-toplevel)

# Use node 18
fnm use

if [[ "$SKIP_NPM_INSTALL" == "" ]]; then
  npm install
fi

if [[ "$SKIP_QJS" == "" ]]; then
  # Build quickjs
  pushd meta/quickjs > /dev/null
  meta/build.sh
  popd > /dev/null
fi

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
meta/scripts/assemble-dts.sh

# generate dist/index.js (bundles in dependencies from npm)
npm run bundle

# compile dist/index.js to bytecode
cp dist/index.js yavascript-internal.js # to have clearer filename in stack traces
meta/quickjs/build/bin/qjs meta/scripts/to-bytecode.mjs \
  yavascript-internal.js \
  dist/index.bin

# generate dist/yavascript (final binary)
cat \
  meta/quickjs/build/bin/qjsbootstrap-bytecode \
  dist/index.bin \
> dist/yavascript
chmod +x dist/yavascript