#!/usr/bin/env bash

set -exuo pipefail
shopt -s globstar

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/../.." # go to root

# this file needs to exist for the module resolve step in bundles.ninja.js
# to work
mkdir -p dist
if [[ ! -e dist/yavascript.d.ts ]]; then
  touch dist/yavascript.d.ts
fi

env BUILDDIR=dist npx --no-install shinobi \
  ./meta/ninja/**/*.ninja.js \
  -o dist/build.ninja

ninja -f dist/build.ninja
