#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/../.." # go to root

mkdir -p dist/bundles
if ! test -e dist/bundles/build.ninja; then
  touch dist/bundles/build.ninja
fi

EXISTING_BUILD_NINJA_CONTENT=`cat dist/bundles/build.ninja`
NEW_BUILD_NINJA_CONTENT=`npx --no-install shinobi ./meta/scripts/assemble-bundles.ninja.js`

if [[ "$NEW_BUILD_NINJA_CONTENT" != "$EXISTING_BUILD_NINJA_CONTENT" ]]; then
  echo "$NEW_BUILD_NINJA_CONTENT" > dist/bundles/build.ninja
fi

ninja -f dist/bundles/build.ninja
