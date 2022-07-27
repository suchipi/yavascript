#!/usr/bin/env bash

set -ex

if [ `uname` == "Linux" ]; then
  ./scripts/build.sh && cp ./dist/yavascript ./bin/linux/
  env WINDOWS=yes ./scripts/build.sh && cp ./dist/yavascript.exe ./bin/win32/
else
  ./scripts/build.sh && cp ./dist/yavascript ./bin/darwin/
fi
