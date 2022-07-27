#!/bin/bash

set -ex

cd tgz-release

VERSION=`cat ../package.json | jq -r .version`

rm -rf ./darwin ./linux ./win32

mkdir -p ./{darwin,linux,win32}/yavascript-${VERSION}/

cp ../bin/darwin/* ./darwin/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./darwin/yavascript-${VERSION}/

cp ../bin/linux/* ./linux/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./linux/yavascript-${VERSION}/

cp ../bin/win32/* ./win32/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./win32/yavascript-${VERSION}/

pushd darwin > /dev/null
tar -czvf yavascript-0.0.1-darwin-amd64.tar.gz yavascript-0.0.1/
popd > /dev/null

pushd linux > /dev/null
tar -czvf yavascript-0.0.1-linux-amd64.tar.gz yavascript-0.0.1/
popd > /dev/null

pushd win32 > /dev/null
tar -czvf yavascript-0.0.1-win32-amd64.tar.gz yavascript-0.0.1/
popd > /dev/null
