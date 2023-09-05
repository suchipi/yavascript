#!/usr/bin/env bash
set -e

# install ninja
sudo apt install ninja-build bat

# ugh, the gh actions image claims to have nvm, but they don't do this for you
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm install
nvm use

set -x

echo PATH: $PATH
which bat

# env SKIP_FNM_USE=1 meta/build.sh
# npm test

exit 1
