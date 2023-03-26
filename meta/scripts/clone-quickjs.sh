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
git checkout b3ae3d374c205cffc15adb52a343d3b48a313b72
popd
