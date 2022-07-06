#!/usr/bin/env bash
set -e

git submodule init
git submodule update
pushd quickjs > /dev/null
make
popd > /dev/null
npm install
