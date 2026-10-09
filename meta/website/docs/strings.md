---
hide_title: true
---
## stripAnsi (function)

Removes ANSI control characters from a string.

**Example**

```ts
const plain = stripAnsi(red("error"));
console.log(plain.length);
```

```ts
declare function stripAnsi(input: string | number | Path): string;
```

## quote (function)

Wraps a string in double quotes, and escapes any double-quotes inside using `\"`.

**Example**

```ts
console.log(quote('She said "hi"'));
```

```ts
declare function quote(input: string | number | Path): string;
```

## black (function)

Wraps a string with the ANSI control characters that will make it print as black text.

**Example**

```ts
console.log(bgWhite(black("dark text on a light background")));
```

```ts
declare function black(input: string | number | Path): string;
```

## red (function)

Wraps a string with the ANSI control characters that will make it print as red text.

**Example**

```ts
console.error(red("Error: file not found"));
```

```ts
declare function red(input: string | number | Path): string;
```

## green (function)

Wraps a string with the ANSI control characters that will make it print as green text.

**Example**

```ts
console.log(green("All tests passed"));
```

```ts
declare function green(input: string | number | Path): string;
```

## yellow (function)

Wraps a string with the ANSI control characters that will make it print as yellow text.

**Example**

```ts
console.warn(yellow("Warning: config file is missing"));
```

```ts
declare function yellow(input: string | number | Path): string;
```

## blue (function)

Wraps a string with the ANSI control characters that will make it print as blue text.

**Example**

```ts
console.log(blue("Downloading dependencies..."));
```

```ts
declare function blue(input: string | number | Path): string;
```

## magenta (function)

Wraps a string with the ANSI control characters that will make it print as magenta text.

**Example**

```ts
console.log(magenta("Deploying to production"));
```

```ts
declare function magenta(input: string | number | Path): string;
```

## cyan (function)

Wraps a string with the ANSI control characters that will make it print as cyan text.

**Example**

```ts
console.log(cyan("https://example.com"));
```

```ts
declare function cyan(input: string | number | Path): string;
```

## white (function)

Wraps a string with the ANSI control characters that will make it print as white text.

**Example**

```ts
console.log(bgBlue(white("light text on a dark background")));
```

```ts
declare function white(input: string | number | Path): string;
```

## gray (function)

Wraps a string with the ANSI control characters that will make it print as gray text. (Alias for [grey](./strings.md#grey-function).)

**Example**

```ts
console.log(gray("(skipped 3 files)"));
```

```ts
declare function gray(input: string | number | Path): string;
```

## grey (function)

Wraps a string with the ANSI control characters that will make it print as grey text. (Alias for [gray](./strings.md#gray-function).)

**Example**

```ts
console.log(grey("(skipped 3 files)"));
```

```ts
declare function grey(input: string | number | Path): string;
```

## bgBlack (function)

Wraps a string with the ANSI control characters that will make it have a black background when printed.

**Example**

```ts
console.log(bgBlack(white(" README.md ")));
```

```ts
declare function bgBlack(input: string | number | Path): string;
```

## bgRed (function)

Wraps a string with the ANSI control characters that will make it have a red background when printed.

**Example**

```ts
console.log(bgRed(" FAIL "), "tests/math.test.ts");
```

```ts
declare function bgRed(input: string | number | Path): string;
```

## bgGreen (function)

Wraps a string with the ANSI control characters that will make it have a green background when printed.

**Example**

```ts
console.log(bgGreen(" PASS "), "tests/math.test.ts");
```

```ts
declare function bgGreen(input: string | number | Path): string;
```

## bgYellow (function)

Wraps a string with the ANSI control characters that will make it have a yellow background when printed.

**Example**

```ts
console.log(bgYellow(black(" WARN ")), "deprecated option");
```

```ts
declare function bgYellow(input: string | number | Path): string;
```

## bgBlue (function)

Wraps a string with the ANSI control characters that will make it have a blue background when printed.

**Example**

```ts
console.log(bgBlue(" INFO "), "server started");
```

```ts
declare function bgBlue(input: string | number | Path): string;
```

## bgMagenta (function)

Wraps a string with the ANSI control characters that will make it have a magenta background when printed.

**Example**

```ts
console.log(bgMagenta(" DEBUG "), "cache miss");
```

```ts
declare function bgMagenta(input: string | number | Path): string;
```

## bgCyan (function)

Wraps a string with the ANSI control characters that will make it have a cyan background when printed.

**Example**

```ts
console.log(bgCyan(black(" NOTE ")), "using default config");
```

```ts
declare function bgCyan(input: string | number | Path): string;
```

## bgWhite (function)

Wraps a string with the ANSI control characters that will make it have a white background when printed.

**Example**

```ts
console.log(bgWhite(black(" v1.0.0 ")));
```

```ts
declare function bgWhite(input: string | number | Path): string;
```

## reset (function)

Prefixes a string with the ANSI control character that resets all styling.

**Example**

```ts
console.log(reset("plain text with no styling"));
```

```ts
declare function reset(input: string | number | Path): string;
```

## bold (function)

Wraps a string with the ANSI control characters that will make it print with a bold style.

**Example**

```ts
console.log(bold("Important:"), "read this first");
```

```ts
declare function bold(input: string | number | Path): string;
```

## dim (function)

Wraps a string with the ANSI control characters that will make it print with a dimmed style.

**Example**

```ts
console.log(dim("last updated 3 days ago"));
```

```ts
declare function dim(input: string | number | Path): string;
```

## italic (function)

Wraps a string with the ANSI control characters that will make it print italicized.

**Example**

```ts
console.log(italic("emphasis"));
```

```ts
declare function italic(input: string | number | Path): string;
```

## underline (function)

Wraps a string with the ANSI control characters that will make it print underlined.

**Example**

```ts
console.log(underline("https://example.com"));
```

```ts
declare function underline(input: string | number | Path): string;
```

## inverse (function)

Wraps a string with ANSI control characters that will make it print with its foreground (text) and background colors swapped.

**Example**

```ts
console.log(inverse(" selected item "));
```

```ts
declare function inverse(input: string | number | Path): string;
```

## hidden (function)

Wraps a string with ANSI control characters that will make it print as hidden.

**Example**

```ts
console.log("password:", hidden("hunter2"));
```

```ts
declare function hidden(input: string | number | Path): string;
```

## strikethrough (function)

Wraps a string with the ANSI control characters that will make it print with a horizontal line through its center.

**Example**

```ts
console.log(strikethrough("buy milk"));
```

```ts
declare function strikethrough(input: string | number | Path): string;
```
