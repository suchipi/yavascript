#!/usr/bin/env bash
set -ex

# faster (but less guaranteed to work) build script, for quick iteration.
# only works on linux/darwin, and you need all the stuff from the docker
# containers installed on the host machine (notably: node, gcc).

# Move to repo root
cd $(git rev-parse --show-toplevel)

# Use node 17
fnm use

if [[ "$SKIP_QJS" == "" ]]; then
  # Build quickjs
  pushd quickjs > /dev/null
  meta/build.sh
  popd > /dev/null
fi

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
./scripts/assemble-dts.sh

# generate dist/index.js (bundles in dependencies from npm)
npm run bundle

# to make the stack traces clearer, we change the filename that will get baked into the binary:
cp dist/index.js ./yavascript-internal.js

# generate dist/yavascript.c
./quickjs/build/qjsc.host -e -D os -D std -S 8000000 -o dist/yavascript.c yavascript-internal.js

if [[ "$(uname)" == "Darwin" ]]; then
  CC="clang"
  LDFLAGS=""
else
  CC="gcc"
  LDFLAGS="-static"
fi

"$CC" \
  "$LDFLAGS" \
  -o dist/yavascript \
  dist/yavascript.c \
  quickjs/build/quickjs-full.host.a \
  -Iquickjs/src/quickjs-libc -Iquickjs/src/quickjs \
  -lm -lpthread -ldl
