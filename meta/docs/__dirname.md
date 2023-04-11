`__dirname` - The absolute path to the folder containing the currently-executing file.

The absolute path to the directory the current file is inside of.

Behaves the same as in Node.js, except that it's also present within ES modules.

```ts
// Defined in yavascript/src/api/__filename-and-__dirname.ts
declare var __dirname: string;
```
