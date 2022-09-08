#!/usr/bin/env bash
set -ex

mkdir -p dist

M4="m4 -Isrc/includes -Isrc/templates -Iquickjs/src/quickjs-libc"

$M4 src/templates/yavascript.d.ts.tmpl > dist/yavascript.d.ts
prettier --write dist/yavascript.d.ts

$M4 src/templates/yavascript-git.d.ts.tmpl > yavascript.d.ts
prettier --write yavascript.d.ts

# copy into npm folder
cp dist/yavascript.d.ts npm
