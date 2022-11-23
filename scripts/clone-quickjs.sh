#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git checkout dc988afab041bf9b5f22c878318f8180f6d4b00e
popd
