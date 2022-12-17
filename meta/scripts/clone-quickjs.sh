#!/usr/bin/env bash

cd meta

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 41889c95729f0ee53e0ebac4736abd0525040688
popd
