# String Styling Functions

YavaScript includes several functions that will wrap strings in ANSI escape codes such that printing those strings to the terminal will cause them to have a different color, style, or background color.

Each of those styling functions has the following signature:

```ts
// Defined in yavascript/src/api/strings
declare function <function-name>(input: string | number): string;
```

Where `<function-name>` can be any of these:

- `black` - make text color black
- `red` - make text color red
- `green` - make text color green
- `yellow` - make text color yellow
- `blue` - make text color blue
- `magenta` - make text color magenta
- `cyan` - make text color cyan
- `white` - make text color white
- `gray` - make text color gray
- `grey` - make text color grey
- `bgBlack` - make text background color black
- `bgRed` - make text background color red
- `bgGreen` - make text background color green
- `bgYellow` - make text background color yellow
- `bgBlue` - make text background color blue
- `bgMagenta` - make text background color magenta
- `bgCyan` - make text background color cyan
- `bgWhite` - make text background color white
- `bold` - make text bold
- `dim` - make text dimmed ("grayed out")
- `italic` - make text italic
- `underline` - make text underlined
- `inverse` - swap the foreground and background text colors
- `hidden` - hide text
- `strikethrough` - strike a horizontal like through text
- `reset` - unset all styles
