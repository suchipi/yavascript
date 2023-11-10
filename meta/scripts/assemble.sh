#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/../.." # go to root

# Use node 18
if [[ "${SKIP_FNM_USE:-}" == "" ]]; then
  fnm use
fi

# grab JS dependencies from npm
if [[ "${SKIP_NPM_INSTALL:-}" == "" ]]; then
  npm install
fi

# this file needs to exist for the module resolve step in bundles.ninja.js
# to work
mkdir -p dist
if [[ ! -e dist/yavascript.d.ts ]]; then
  touch dist/yavascript.d.ts
fi

env BUILDDIR=dist npx --no-install shinobi \
  ./meta/scripts/rules.ninja.js \
  ./meta/scripts/dts.ninja.js \
  ./meta/scripts/docs.ninja.js \
  ./meta/scripts/bundles.ninja.js \
  ./meta/scripts/bytecode.ninja.js \
  ./meta/scripts/programs.ninja.js \
  -o dist/build.ninja

ninja -f dist/build.ninja
