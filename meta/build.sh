#!/usr/bin/env bash
set -ex

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/.." # go to root

# Use node 18
if [[ "${SKIP_FNM_USE:-}" == "" ]]; then
  fnm use
fi

# grab JS dependencies from npm
if [[ "${SKIP_NPM_INSTALL:-}" == "" ]]; then
  npm install
fi

meta/scripts/ninja-build.sh
