#!/usr/bin/env bash
set -ex

mkdir -p dist

# generate dist/index.js
npx kame bundle --resolver ./kame-resolver.js

# generate dist/yavascript.c
# to make the stack traces clearer:
mv dist/index.js ./yavascript-internal.js
./quickjs/build/src/qjsc/qjsc.target -e -D os -D std -o dist/yavascript.c yavascript-internal.js
mv yavascript-internal.js dist/index.js

# generate dist/yavascript
gcc -static -o dist/yavascript dist/yavascript.c quickjs/build/src/archive/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate dist/yavascript.d.ts
echo "// quickjs/src/quickjs-libc/quickjs-libc.d.ts" > dist/yavascript.d.ts
cat ./quickjs/src/quickjs-libc/quickjs-libc.d.ts >> dist/yavascript.d.ts
echo "// src/globals.d.ts" >> dist/yavascript.d.ts
cat ./src/globals.d.ts >> dist/yavascript.d.ts
