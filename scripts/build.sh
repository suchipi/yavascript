#!/usr/bin/env bash
set -ex

git submodule init
git submodule update
pushd quickjs > /dev/null
if [ "$WINDOWS" == "yes" ]; then
  env VARIANT=windows make
else
  make
fi
popd > /dev/null
npm install

mkdir -p dist

# generate dist/index.js
npx kame bundle --resolver ./src/kame-config.js --loader ./src/kame-config.js

# generate dist/yavascript.c
# to make the stack traces clearer:
mv dist/index.js ./yavascript-internal.js
./quickjs/build/src/qjsc/qjsc.host -e -D os -D std -o dist/yavascript.c yavascript-internal.js
mv yavascript-internal.js dist/index.js

# generate dist/yavascript
if [ "$WINDOWS" == "yes" ]; then
  x86_64-w64-mingw32-gcc -static -o dist/yavascript.exe dist/yavascript.c quickjs/build-windows/src/archive/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread
elif [ `uname` == "Darwin" ]; then
  clang -o dist/yavascript dist/yavascript.c quickjs/build/src/archive/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl
else
  gcc -static -o dist/yavascript dist/yavascript.c quickjs/build/src/archive/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl
fi

# remove dist/yavascript.c
rm dist/yavascript.c

# generate dist/yavascript.d.ts
echo > dist/yavascript.d.ts
echo "// ---------------" >> dist/yavascript.d.ts
echo "// YavaScript APIs" >> dist/yavascript.d.ts
echo "// ---------------" >> dist/yavascript.d.ts
echo "" >> dist/yavascript.d.ts
cat ./src/globals.d.ts >> dist/yavascript.d.ts
echo "" >> dist/yavascript.d.ts
echo "// ------------------------------------------" >> dist/yavascript.d.ts
echo "// QuickJS APIs, which YavaScript builds upon" >> dist/yavascript.d.ts
echo "// ------------------------------------------" >> dist/yavascript.d.ts
echo "" >> dist/yavascript.d.ts
cat ./quickjs/src/quickjs-libc/quickjs-libc.d.ts >> dist/yavascript.d.ts
echo "" >> dist/yavascript.d.ts

# copy yavascript.d.ts to repo root (so people can read it in GitHub)
echo > ./yavascript.d.ts
echo "// NOTE: This copy of yavascript.d.ts reflects what is in git." >> ./yavascript.d.ts
echo "// APIs may differ from what you have installed." >> ./yavascript.d.ts
echo "// If available, consult the copy of yavascript.d.ts that was distributed with your install." >> ./yavascript.d.ts
echo >> ./yavascript.d.ts
cat dist/yavascript.d.ts >> ./yavascript.d.ts
