# `scriptArgs` - The `argv` passed to yavascript

`scriptArgs` is a frozen Array containing the strings the yavascript binary was invoked with at the command line. This array is sometimes called 'argv'.

For instance, if you run:

```sh
$ yavascript myscript.js
```

`scriptArgs` will be:

```json
["yavascript", "myscript.js"]
```

likewise, if you run:

```sh
$ yavascript -- one two three --four five -v
```

then `scriptArgs` will be:

```json
["yavascript", "--", "one", "two", "three", "--four", "five", "-v"]
```

```ts
// Defined in quickjs
declare const scriptArgs: ReadonlyArray<string>;
```
