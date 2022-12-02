#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 1d7d94692da278ed537bcc7cebfc1dcf13a047c4
popd
