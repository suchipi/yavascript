# `__dirname` - The absolute path to the folder containing the currently-executing file.

The absolute path to the directory containing the currently-executing file.

Behaves the same as in Node.js, except that it's also present within ES modules.

> Example: `/home/suchipi/some-folder`

```ts
// Defined in yavascript/src/api/__filename-and-__dirname
declare var __dirname: string;
```
