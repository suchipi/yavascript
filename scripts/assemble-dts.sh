#!/usr/bin/env bash
set -ex

mkdir -p dist

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

# copy into npm folder
cp dist/yavascript.d.ts npm
