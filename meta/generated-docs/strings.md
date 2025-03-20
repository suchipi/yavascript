- [stripAnsi (function)](#stripansi-function)
- [quote (function)](#quote-function)
- [black (function)](#black-function)
- [red (function)](#red-function)
- [green (function)](#green-function)
- [yellow (function)](#yellow-function)
- [blue (function)](#blue-function)
- [magenta (function)](#magenta-function)
- [cyan (function)](#cyan-function)
- [white (function)](#white-function)
- [gray (function)](#gray-function)
- [grey (function)](#grey-function)
- [bgBlack (function)](#bgblack-function)
- [bgRed (function)](#bgred-function)
- [bgGreen (function)](#bggreen-function)
- [bgYellow (function)](#bgyellow-function)
- [bgBlue (function)](#bgblue-function)
- [bgMagenta (function)](#bgmagenta-function)
- [bgCyan (function)](#bgcyan-function)
- [bgWhite (function)](#bgwhite-function)
- [reset (function)](#reset-function)
- [bold (function)](#bold-function)
- [dim (function)](#dim-function)
- [italic (function)](#italic-function)
- [underline (function)](#underline-function)
- [inverse (function)](#inverse-function)
- [hidden (function)](#hidden-function)
- [strikethrough (function)](#strikethrough-function)

# stripAnsi (function)

Removes ANSI control characters from a string.

```ts
declare function stripAnsi(input: string | number | Path): string;
```

# quote (function)

Wraps a string in double quotes, and escapes any double-quotes inside using `\"`.

```ts
declare function quote(input: string | number | Path): string;
```

# black (function)

Wraps a string with the ANSI control characters that will make it print as black text.

```ts
declare function black(input: string | number | Path): string;
```

# red (function)

Wraps a string with the ANSI control characters that will make it print as red text.

```ts
declare function red(input: string | number | Path): string;
```

# green (function)

Wraps a string with the ANSI control characters that will make it print as green text.

```ts
declare function green(input: string | number | Path): string;
```

# yellow (function)

Wraps a string with the ANSI control characters that will make it print as yellow text.

```ts
declare function yellow(input: string | number | Path): string;
```

# blue (function)

Wraps a string with the ANSI control characters that will make it print as blue text.

```ts
declare function blue(input: string | number | Path): string;
```

# magenta (function)

Wraps a string with the ANSI control characters that will make it print as magenta text.

```ts
declare function magenta(input: string | number | Path): string;
```

# cyan (function)

Wraps a string with the ANSI control characters that will make it print as cyan text.

```ts
declare function cyan(input: string | number | Path): string;
```

# white (function)

Wraps a string with the ANSI control characters that will make it print as white text.

```ts
declare function white(input: string | number | Path): string;
```

# gray (function)

Wraps a string with the ANSI control characters that will make it print as gray text. (Alias for [grey](/meta/generated-docs/strings.md#grey-function).)

```ts
declare function gray(input: string | number | Path): string;
```

# grey (function)

Wraps a string with the ANSI control characters that will make it print as grey text. (Alias for [gray](/meta/generated-docs/strings.md#gray-function).)

```ts
declare function grey(input: string | number | Path): string;
```

# bgBlack (function)

Wraps a string with the ANSI control characters that will make it have a black background when printed.

```ts
declare function bgBlack(input: string | number | Path): string;
```

# bgRed (function)

Wraps a string with the ANSI control characters that will make it have a red background when printed.

```ts
declare function bgRed(input: string | number | Path): string;
```

# bgGreen (function)

Wraps a string with the ANSI control characters that will make it have a green background when printed.

```ts
declare function bgGreen(input: string | number | Path): string;
```

# bgYellow (function)

Wraps a string with the ANSI control characters that will make it have a yellow background when printed.

```ts
declare function bgYellow(input: string | number | Path): string;
```

# bgBlue (function)

Wraps a string with the ANSI control characters that will make it have a blue background when printed.

```ts
declare function bgBlue(input: string | number | Path): string;
```

# bgMagenta (function)

Wraps a string with the ANSI control characters that will make it have a magenta background when printed.

```ts
declare function bgMagenta(input: string | number | Path): string;
```

# bgCyan (function)

Wraps a string with the ANSI control characters that will make it have a cyan background when printed.

```ts
declare function bgCyan(input: string | number | Path): string;
```

# bgWhite (function)

Wraps a string with the ANSI control characters that will make it have a white background when printed.

```ts
declare function bgWhite(input: string | number | Path): string;
```

# reset (function)

Prefixes a string with the ANSI control character that resets all styling.

```ts
declare function reset(input: string | number | Path): string;
```

# bold (function)

Wraps a string with the ANSI control characters that will make it print with a bold style.

```ts
declare function bold(input: string | number | Path): string;
```

# dim (function)

Wraps a string with the ANSI control characters that will make it print with a dimmed style.

```ts
declare function dim(input: string | number | Path): string;
```

# italic (function)

Wraps a string with the ANSI control characters that will make it print italicized.

```ts
declare function italic(input: string | number | Path): string;
```

# underline (function)

Wraps a string with the ANSI control characters that will make it print underlined.

```ts
declare function underline(input: string | number | Path): string;
```

# inverse (function)

Wraps a string with ANSI control characters that will make it print with its foreground (text) and background colors swapped.

```ts
declare function inverse(input: string | number | Path): string;
```

# hidden (function)

Wraps a string with ANSI control characters that will make it print as hidden.

```ts
declare function hidden(input: string | number | Path): string;
```

# strikethrough (function)

Wraps a string with the ANSI control characters that will make it print with a horizontal line through its center.

```ts
declare function strikethrough(input: string | number | Path): string;
```
