# `__filename` - The absolute path to the currently-executing file.

The absolute path to the currently-executing file (whether script or module).

Behaves the same as in Node.js, except that it's also present within ES modules.

> Example: `/home/suchipi/some-folder/some-file.js`

```ts
// Defined in yavascript/src/api/__filename-and-__dirname
declare var __filename: string;
```
