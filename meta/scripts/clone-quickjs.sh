#!/usr/bin/env bash

cd meta

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 434323f66d34ca5663e4018a47d4cf88f6425ef1
popd
