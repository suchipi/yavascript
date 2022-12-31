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
git checkout 2215c9e903a978b0b020a9657fa19eef20bec8e4
popd
