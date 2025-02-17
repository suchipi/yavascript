# \_\_filename (string)

The absolute path to the currently-executing file (whether script or module).

Behaves the same as in Node.js, except that it's also present within ES
modules.

Example: `/home/suchipi/some-folder/some-file.js`

```ts
var __filename: string;
```

# \_\_dirname (string)

The absolute path to the directory containing the currently-executing file.

Behaves the same as in Node.js, except that it's also present within ES
modules.

Example: `/home/suchipi/some-folder`

```ts
var __dirname: string;
```
