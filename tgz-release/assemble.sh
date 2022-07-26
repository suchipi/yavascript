#!/bin/bash

set -ex

VERSION=`cat ../package.json | jq -r .version`

rm -rf ./darwin ./linux ./win32

mkdir -p ./{darwin,linux,win32}/yavascript-${VERSION}/

cp ../bin/darwin/* ./darwin/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./darwin/yavascript-${VERSION}/

cp ../bin/linux/* ./linux/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./linux/yavascript-${VERSION}/

cp ../bin/win32/* ./win32/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./win32/yavascript-${VERSION}/
