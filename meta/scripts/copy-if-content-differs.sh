#!/usr/bin/env bash

set -euo pipefail

FROM="$1"
TO="$2"

if ! test -e "$2"; then
  mkdir -p $(dirname "$2")
  touch "$2"
fi

EXISTING_CONTENT=$(cat "$2")
NEW_CONTENT=$(cat "$1")

if [[ "$NEW_CONTENT" != "$EXISTING_CONTENT" ]]; then
  echo "copying $1 to $2" 1>&2
  cp "$1" "$2"
fi
