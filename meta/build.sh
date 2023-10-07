#!/usr/bin/env bash
set -ex

# build yavascript for the running platform only. for development

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

# compile markdown docs to ANSI-escape-sequence-containing txt files
if [[ "$SKIP_GLOW" == "" ]]; then
  meta/scripts/assemble-docs.sh
fi

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
meta/scripts/assemble-dts.js

# generate dist/index.js (bundles in dependencies from npm)
npm run bundle -- --output dist/index.js
if [[ "$WITH_PRIMORDIALS" == "1" ]]; then
  npm run bundle:primordials -- --output dist/primordials.js
fi

# compile dist/index.js to bytecode
cp dist/index.js yavascript-internal.js # to have clearer filename in stack traces
npx --no-install qjs meta/scripts/to-bytecode.mjs \
  yavascript-internal.js \
  dist/index.bin

PLATFORM=$(node -e 'console.log(require("@suchipi/quickjs").identifyCurrentPlatform().name)')

# generate dist/yavascript (final binary)
cat \
  "node_modules/@suchipi/quickjs/build/$PLATFORM/bin/qjsbootstrap-bytecode" \
  dist/index.bin \
> dist/yavascript
chmod +x dist/yavascript
