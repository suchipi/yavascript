#!/usr/bin/env bash
set -ex

mkdir -p dist

# generate dist/index.js
npx kame bundle --resolver ./kame-resolver.js

# generate dist/tonna.c
./quickjs/build/src/qjsc/qjsc.target -e -D os -D std -o dist/tonna.c dist/index.js

# generate dist/tonna
gcc -static -o dist/tonna dist/tonna.c quickjs/build/src/archive/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate dist/tonna.d.ts
echo "// quickjs/src/quickjs-libc/quickjs-libc.d.ts" > dist/tonna.d.ts
cat ./quickjs/src/quickjs-libc/quickjs-libc.d.ts >> dist/tonna.d.ts
echo "// src/globals.d.ts" >> dist/tonna.d.ts
cat ./src/globals.d.ts >> dist/tonna.d.ts
