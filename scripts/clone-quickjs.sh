#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git checkout 42df4db469a537a0dc092aca4ddd8021b7508cfb
popd
