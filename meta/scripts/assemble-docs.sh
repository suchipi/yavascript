#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/../.." # go to root

mkdir -p dist/docs
if ! test -e dist/docs/build.ninja; then
  touch dist/docs/build.ninja
fi

EXISTING_BUILD_NINJA_CONTENT=`cat dist/docs/build.ninja`
NEW_BUILD_NINJA_CONTENT=`npx --no-install shinobi ./meta/scripts/assemble-docs.ninja.js`

if [[ "$NEW_BUILD_NINJA_CONTENT" != "$EXISTING_BUILD_NINJA_CONTENT" ]]; then
  echo "$NEW_BUILD_NINJA_CONTENT" > dist/docs/build.ninja
fi

ninja -f dist/docs/build.ninja
