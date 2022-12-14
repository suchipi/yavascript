#!/usr/bin/env bash

cd meta

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 7c2f6fd6579ab3345eb0c118d8d82165a751cb77
popd
