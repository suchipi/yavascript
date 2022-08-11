#!/bin/bash

set -ex

cd tgz-release

VERSION=`cat ../package.json | jq -r .version`

rm -rf ./*

mkdir -p ./{darwin,darwin-arm,linux,windows}/yavascript-${VERSION}/

cp ../bin/darwin/* ./darwin/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./darwin/yavascript-${VERSION}/

cp ../bin/darwin-arm/* ./darwin-arm/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./darwin-arm/yavascript-${VERSION}/

cp ../bin/linux/* ./linux/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./linux/yavascript-${VERSION}/

cp ../bin/windows/* ./windows/yavascript-${VERSION}/
cp ../dist/yavascript.d.ts ./windows/yavascript-${VERSION}/

pushd darwin > /dev/null
tar -czvf yavascript-${VERSION}-darwin-amd64.tar.gz yavascript-${VERSION}/
popd > /dev/null

pushd darwin-arm > /dev/null
tar -czvf yavascript-${VERSION}-darwin-arm.tar.gz yavascript-${VERSION}/
popd > /dev/null

pushd linux > /dev/null
tar -czvf yavascript-${VERSION}-linux-amd64.tar.gz yavascript-${VERSION}/
popd > /dev/null

pushd windows > /dev/null
tar -czvf yavascript-${VERSION}-windows-amd64.tar.gz yavascript-${VERSION}/
popd > /dev/null
