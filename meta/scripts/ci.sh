#!/usr/bin/env bash
set -e

# install ninja
sudo apt install ninja-build

# install glow
wget https://github.com/charmbracelet/glow/releases/download/v1.5.0/glow_1.5.0_linux_amd64.deb
sudo dpkg -i glow_1.5.0_linux_amd64.deb

# ugh, the gh actions image claims to have nvm, but they don't do this for you
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm install
nvm use

set -x

bin/yavascript meta/scripts/clone-quickjs.ts
env SKIP_FNM_USE=1 meta/build.sh
npm test
