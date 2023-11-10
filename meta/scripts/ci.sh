#!/usr/bin/env bash
set -e

# install ninja
sudo apt-get install -y ninja-build bat

# ubuntu package names bat binary "batcat" instead of bat...
ln -s /usr/bin/batcat /usr/local/bin/bat

# ugh, the gh actions image claims to have nvm, but they don't do this for you
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm install
nvm use

set -x

env SKIP_FNM_USE=1 meta/build.sh
npm run typecheck
# commented out until I can get it working locally
# meta/docker/wine-test-image/build.sh
npm test
