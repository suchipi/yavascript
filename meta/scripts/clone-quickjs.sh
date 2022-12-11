#!/usr/bin/env bash

cd meta

if [ ! -e 'quickjs' ]; then
  git clone git@github.com:suchipi/quickjs.git
fi

pushd quickjs > /dev/null
git fetch origin
git checkout db22dd0eb625aea8fb6cf6feac7405b87fd83ca1
popd
