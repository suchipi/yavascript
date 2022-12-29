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
git checkout f0c7ddf8106fc0015db1279dbb0ec77a8a3b31f0
popd
