#!/usr/bin/env bash
set -ex

# install ninja
sudo apt-get install -y ninja-build

export NVM_DIR="$HOME/.nvm"
# this is really chatty...
echo "+ source "$NVM_DIR/nvm.sh" --no-use"
set +x
  source "$NVM_DIR/nvm.sh" --no-use
set -x

nvm install
nvm use

env SKIP_FNM_USE=1 meta/build.sh
npm run typecheck
# commented out until I can get it working locally
# meta/docker/wine-test-image/build.sh
npm test
