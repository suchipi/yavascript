#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/../.." # go to root

NINJA_BUILD_PATH="$1"
NINJA_JS_FILES="${@:2}"

mkdir -p $(dirname "$NINJA_BUILD_PATH")
if ! test -e "$NINJA_BUILD_PATH"; then
  touch "$NINJA_BUILD_PATH"
fi

EXISTING_BUILD_NINJA_CONTENT=$(cat "$NINJA_BUILD_PATH")
NEW_BUILD_NINJA_CONTENT=$(npx --no-install shinobi $NINJA_JS_FILES)

if [[ "$NEW_BUILD_NINJA_CONTENT" != "$EXISTING_BUILD_NINJA_CONTENT" ]]; then
  echo "$NEW_BUILD_NINJA_CONTENT" > "$NINJA_BUILD_PATH"
fi

# no-op if we didn't update the ninja.build file
ninja -f "$NINJA_BUILD_PATH"
