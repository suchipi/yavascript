#!/usr/bin/env bash
set -ex

cd meta

if [ ! -e 'quickjs' ]; then
  if [[ "${CI:-}" != "" ]]; then
    git clone https://github.com/suchipi/quickjs.git
  else
    git clone git@github.com:suchipi/quickjs.git
  fi
fi

pushd quickjs > /dev/null
git fetch origin
git checkout eae9dfe0da5620b4d3874dfddd20cdea37936364
popd
