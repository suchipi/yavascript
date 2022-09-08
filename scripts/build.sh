#!/usr/bin/env bash
set -ex

# Move to repo root
cd $(git rev-parse --show-toplevel)

git submodule init
git submodule update

# build quickjs (dep of yavascript)
if [[ "$SKIP_QJS" == "" ]]; then
  pushd quickjs > /dev/null
  ./docker/build-all.sh
  popd > /dev/null
fi

in_docker() {
  docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" $@
}

# grab JS dependencies from npm
in_docker node:17.4.0 npm install

# generate dist/index.js (bundles in dependencies from npm)
mkdir -p dist
rm -rf dist
in_docker node:17.4.0 npm run bundle

# to make the stack traces clearer, we change the filename that will get baked into the binary:
cp dist/index.js ./yavascript-internal.js
# generate dist/yavascript.c
in_docker suchipi/quickjs-build:linux-from-linux ./quickjs/docker/artifacts/linux-from-linux/qjsc.target -e -D os -D std -o dist/yavascript.c yavascript-internal.js

mkdir -p bin

# generate bin/darwin-arm/yavascript
mkdir -p bin/darwin-arm
in_docker suchipi/quickjs-build:darwin-arm-from-linux arm64-apple-darwin20.4-clang -o bin/darwin-arm/yavascript dist/yavascript.c quickjs/docker/artifacts/darwin-arm-from-linux/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate bin/darwin/yavascript
mkdir -p bin/darwin
in_docker suchipi/quickjs-build:darwin-from-linux x86_64-apple-darwin20.4-clang -o bin/darwin/yavascript dist/yavascript.c quickjs/docker/artifacts/darwin-from-linux/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate bin/linux/yavascript
mkdir -p bin/linux
in_docker suchipi/quickjs-build:linux-from-linux gcc -static -o bin/linux/yavascript dist/yavascript.c quickjs/docker/artifacts/linux-from-linux/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate bin/windows/yavascript
mkdir -p bin/windows
in_docker suchipi/quickjs-build:windows-from-linux x86_64-w64-mingw32-gcc -static -o bin/windows/yavascript.exe dist/yavascript.c quickjs/docker/artifacts/windows-from-linux/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread

# remove dist/yavascript.c
rm dist/yavascript.c

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
./scripts/assemble-dts.sh

# copy stuff into npm folder
cp -R bin npm
cp README.md npm
