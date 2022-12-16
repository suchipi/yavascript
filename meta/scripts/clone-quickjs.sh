#!/usr/bin/env bash

cd meta

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 0cccf6356f0e9fa757263cb2aa06c5ab7a44bfe6
popd
