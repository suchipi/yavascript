#!/usr/bin/env bash

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout 960af0e045e595f841ac7ede36b6abf96c547f64
popd
