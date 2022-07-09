#!/usr/bin/env bash
set -ex

mkdir -p dist

# generate dist/index.js
npx kame bundle --resolver ./kame-resolver.js

# generate dist/tonna.c
./quickjs/build/src/qjsc/qjsc.target -e -D os -D std -o dist/tonna.c dist/index.js

# generate dist/tonna
gcc -static -o dist/tonna dist/tonna.c quickjs/build/src/archive/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl
