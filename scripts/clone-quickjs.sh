#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 381d7a4aa79e405ab9c80d83d4e0e29b4ac9f4ce
popd
