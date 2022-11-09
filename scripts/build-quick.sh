#!/usr/bin/env bash
set -ex

# faster (but less guaranteed to work) build script, for quick iteration.
# only works on linux, and you need all the stuff from the docker containers
# installed on the host machine (notably: node, gcc).

# Move to repo root
cd $(git rev-parse --show-toplevel)

# Use node 17
fnm use

# Build quickjs
pushd quickjs
make tup
popd

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
./scripts/assemble-dts.sh

# generate dist/index.js (bundles in dependencies from npm)
npm run bundle

# to make the stack traces clearer, we change the filename that will get baked into the binary:
cp dist/index.js ./yavascript-internal.js

# generate dist/yavascript.c
./quickjs/build/src/qjsc/qjsc.target -e -D os -D std -o dist/yavascript.c yavascript-internal.js

# generate bin/linux/yavascript
mkdir -p bin/linux
gcc -static -o bin/linux/yavascript dist/yavascript.c quickjs/build/src/archives/full/quickjs-full.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl
