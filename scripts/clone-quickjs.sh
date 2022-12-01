#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 83c05dcc5ae1be4d02c5e3e86d71fa49ec673207
popd
