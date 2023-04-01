#!/usr/bin/env bash
set -e

sudo apt install ninja-build

# ugh, the gh actions image claims to have nvm, but they don't do this for you
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm install
nvm use

set -x

bin/yavascript meta/scripts/clone-quickjs.ts
env SKIP_FNM_USE=1 meta/build.sh
npm test
