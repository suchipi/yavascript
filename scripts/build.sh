#!/usr/bin/env bash
set -ex

# Move to repo root
cd $(git rev-parse --show-toplevel)

scripts/clone-quickjs.sh

# build quickjs (dep of yavascript)
if [[ "$SKIP_QJS" == "" ]]; then
  pushd quickjs > /dev/null
  ./meta/docker/build-all.sh
  popd > /dev/null
fi

if [[ "$(uname)" == "Darwin" ]]; then
# Don't do uid/gid remapping in macOS, as Docker Desktop does its own
# uid/gid mapping from root to the normal user
in_docker() {
  docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" $@
}
else
# But *do* do it on Linux, where they're probably not using Docker Desktop
in_docker() {
  docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" --user "$(id -u):$(id -g)" $@
}
fi

# grab JS dependencies from npm
in_docker node:17.4.0 npm install

rm -rf dist
mkdir -p dist

# generate dist/yavascript.d.ts, yavascript.d.ts, and npm/yavascript.d.ts
in_docker node:17.4.0 ./scripts/assemble-dts.sh

# generate dist/index.js (bundles in dependencies from npm)
in_docker node:17.4.0 npm run bundle

mkdir -p bin

INCLUDES="-Iquickjs/src/quickjs-libc -Iquickjs/src/quickjs"

# generate bin/darwin-arm/yavascript
mkdir -p bin/darwin-arm
cat quickjs/build/darwin-arm/qjsbootstrap.target dist/index.js > bin/darwin-arm/yavascript && chmod +x bin/darwin-arm/yavascript

# generate bin/darwin/yavascript
mkdir -p bin/darwin
cat quickjs/build/darwin-x86/qjsbootstrap.target dist/index.js > bin/darwin/yavascript && chmod +x bin/darwin/yavascript

# generate bin/linux/yavascript
mkdir -p bin/linux
cat quickjs/build/linux/qjsbootstrap.target dist/index.js > bin/linux/yavascript && chmod +x bin/linux/yavascript

# generate bin/windows/yavascript.exe
mkdir -p bin/windows
cat quickjs/build/windows/qjsbootstrap.target dist/index.js > bin/windows/yavascript.exe && chmod +x bin/windows/yavascript.exe

# copy stuff into npm folder
cp -R bin npm
cp README.md npm
