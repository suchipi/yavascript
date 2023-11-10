#!/usr/bin/env bash
set -ex

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/.." # go to root

meta/scripts/ninja-build.sh
