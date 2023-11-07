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
if [[ "$SKIP_DOCS" == "" ]]; then
  meta/scripts/assemble-docs.sh
fi

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
meta/scripts/assemble-dts.js

# generate dist/index.js (bundles in dependencies from npm)
meta/scripts/assemble-bundles.sh

PLATFORM=$(node -e 'console.log(require("@suchipi/quickjs").identifyCurrentPlatform().name)')

# generate dist/yavascript (final binary)
cat \
  "node_modules/@suchipi/quickjs/build/$PLATFORM/bin/qjsbootstrap-bytecode" \
  dist/bundles/index.bin \
> dist/yavascript
chmod +x dist/yavascript
