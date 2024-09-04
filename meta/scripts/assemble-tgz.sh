#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR/../.." # go to root
ROOTDIR="$PWD"

VERSION=`node -e 'console.log(require("./src/hardcoded/compile-time.js").version)'`

if test -e meta/tgz-release; then
  rm -rf meta/tgz-release
fi
mkdir -p meta/tgz-release
cd meta/tgz-release

TARGETS=(
  aarch64-apple-darwin
  aarch64-unknown-linux-gnu
  aarch64-unknown-linux-musl
  aarch64-unknown-linux-static
  x86_64-apple-darwin
  x86_64-pc-windows-static
  x86_64-unknown-linux-gnu
  x86_64-unknown-linux-musl
  x86_64-unknown-linux-static
)
for TARGET in "${TARGETS[@]}"; do
  mkdir -p "./$TARGET/yavascript-$VERSION"

  cp "$ROOTDIR"/dist/bin/"$TARGET"/* "./$TARGET/yavascript-$VERSION"
  cp "$ROOTDIR"/dist/yavascript.d.ts "./$TARGET/yavascript-$VERSION/"

  pushd "$TARGET" > /dev/null
    tar -czvf "../yavascript-$VERSION-$TARGET.tar.gz" "yavascript-$VERSION/"
  popd > /dev/null
done
