#!/usr/bin/env bash
set -ex

tsc
./quickjs/build/src/qjsc/qjsc.target -e -o dist/tonna.c dist/index.js
gcc -static -o dist/tonna dist/tonna.c quickjs/build/src/{cutils,libbf,libregexp,libunicode,quickjs,quickjs-libc}/*.target.o -Iquickjs/src/quickjs-libc -lm -lpthread -ldl
