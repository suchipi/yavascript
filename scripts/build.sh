#!/usr/bin/env bash
set -ex

# Move to repo root
cd $(git rev-parse --show-toplevel)

git submodule init
git submodule update

# build quickjs (dep of yavascript)
pushd quickjs > /dev/null
./docker/build-all.sh
popd > /dev/null

# grab JS dependencies from npm
npm install

# generate dist/index.js (bundles in dependencies from npm)
mkdir -p dist
rm -rf dist
npx kame bundle --resolver ./src/kame-config.js --loader ./src/kame-config.js

# to make the stack traces clearer, we change the filename that will get baked into the binary:
mv dist/index.js ./yavascript-internal.js
# generate dist/yavascript.c
docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" suchipi/quickjs-build:linux ./quickjs/docker/artifacts/linux/qjsc.target -e -D os -D std -o dist/yavascript.c yavascript-internal.js
mv yavascript-internal.js dist/index.js

mkdir -p bin

# generate bin/darwin-arm/yavascript
mkdir -p bin/darwin-arm
docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" suchipi/quickjs-build:darwin-arm arm64-apple-darwin20.4-clang -o bin/darwin-arm/yavascript dist/yavascript.c quickjs/docker/artifacts/darwin-arm/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate bin/darwin/yavascript
mkdir -p bin/darwin
docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" suchipi/quickjs-build:darwin x86_64-apple-darwin20.4-clang -o bin/darwin/yavascript dist/yavascript.c quickjs/docker/artifacts/darwin/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate bin/linux/yavascript
mkdir -p bin/linux
docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" suchipi/quickjs-build:linux gcc -static -o bin/linux/yavascript dist/yavascript.c quickjs/docker/artifacts/linux/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread -ldl

# generate bin/windows/yavascript
mkdir -p bin/windows
docker run --rm -it -v $PWD:/opt/yavascript -w "/opt/yavascript" suchipi/quickjs-build:windows x86_64-w64-mingw32-gcc -static -o bin/windows/yavascript.exe dist/yavascript.c quickjs/docker/artifacts/windows/quickjs.target.a -Iquickjs/src/quickjs-libc -lm -lpthread

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

# copy stuff into npm folder
cp -R bin npm
cp dist/yavascript.d.ts npm
cp README.md npm
