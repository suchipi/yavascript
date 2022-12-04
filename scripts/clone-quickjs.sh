#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 37311a95f3b82149e4297816fd6dba73d8185efe
popd
