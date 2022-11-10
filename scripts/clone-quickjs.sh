#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git checkout 6fb7410b3f14133cbf2185ece0803fdca90c946d
popd
