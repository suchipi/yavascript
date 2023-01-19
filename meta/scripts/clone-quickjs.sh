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
git checkout b1250b4f98580ecf21192339eec466b124993228
popd
