#!/usr/bin/env bash
set -ex

mkdir -p dist

MACARONI="npx @suchipi/macaroni --include-paths src,src/api,src/api/commands,src/api/exec,src/templates,meta/quickjs/src/quickjs,meta/quickjs/src/quickjs-libc,meta/quickjs/src/quickjs-libbytecode,meta/quickjs/src/quickjs-libcontext"

$MACARONI src/templates/yavascript.d.ts.tmpl > dist/yavascript.d.ts
npx prettier --write dist/yavascript.d.ts

$MACARONI src/templates/yavascript-git.d.ts.tmpl > yavascript.d.ts
npx prettier --write yavascript.d.ts

# copy into npm folder
cp dist/yavascript.d.ts meta/npm
