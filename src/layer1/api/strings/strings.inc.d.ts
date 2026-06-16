/**
 * Removes ANSI control characters from a string.
 */
declare function stripAnsi(input: string | number | Path): string;

/**
 * Wraps a string in double quotes, and escapes any double-quotes inside using `\"`.
 */
declare function quote(input: string | number | Path): string;

// Colors

/** Wraps a string with the ANSI control characters that will make it print as black text. */
declare function black(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as red text. */
declare function red(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as green text. */
declare function green(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as yellow text. */
declare function yellow(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as blue text. */
declare function blue(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as magenta text. */
declare function magenta(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as cyan text. */
declare function cyan(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as white text. */
declare function white(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as gray text. (Alias for {@link grey}.) */
declare function gray(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print as grey text. (Alias for {@link gray}.) */
declare function grey(input: string | number | Path): string;

// Background Colors

/** Wraps a string with the ANSI control characters that will make it have a black background when printed. */
declare function bgBlack(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a red background when printed. */
declare function bgRed(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a green background when printed. */
declare function bgGreen(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a yellow background when printed. */
declare function bgYellow(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a blue background when printed. */
declare function bgBlue(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a magenta background when printed. */
declare function bgMagenta(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a cyan background when printed. */
declare function bgCyan(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it have a white background when printed. */
declare function bgWhite(input: string | number | Path): string;

// Modifiers

/** Prefixes a string with the ANSI control character that resets all styling. */
declare function reset(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print with a bold style. */
declare function bold(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print with a dimmed style. */
declare function dim(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print italicized. */
declare function italic(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print underlined. */
declare function underline(input: string | number | Path): string;
/** Wraps a string with ANSI control characters that will make it print with its foreground (text) and background colors swapped. */
declare function inverse(input: string | number | Path): string;
/** Wraps a string with ANSI control characters that will make it print as hidden. */
declare function hidden(input: string | number | Path): string;
/** Wraps a string with the ANSI control characters that will make it print with a horizontal line through its center. */
declare function strikethrough(input: string | number | Path): string;
