/**
 * Remove ANSI control characters from a string.
 */
declare function stripAnsi(input: string | number | Path): string;

/**
 * Wrap a string in double quotes, and escape any double-quotes inside using `\"`.
 */
declare function quote(input: string | number | Path): string;

// Colors

/** Wrap a string with the ANSI control characters that will make it print as black text. */
declare function black(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as red text. */
declare function red(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as green text. */
declare function green(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as yellow text. */
declare function yellow(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as blue text. */
declare function blue(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as magenta text. */
declare function magenta(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as cyan text. */
declare function cyan(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as white text. */
declare function white(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as gray text. */
declare function gray(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print as grey text. */
declare function grey(input: string | number | Path): string;

// Background Colors

/** Wrap a string with the ANSI control characters that will make it have a black background. */
declare function bgBlack(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it have a red background. */
declare function bgRed(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it have a green background. */
declare function bgGreen(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it have a yellow background. */
declare function bgYellow(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it have a blue background. */
declare function bgBlue(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it have a magenta background. */
declare function bgMagenta(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it have a cyan background. */
declare function bgCyan(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it have a white background. */
declare function bgWhite(input: string | number | Path): string;

// Modifiers

/** Wrap a string with the ANSI control character that resets all styling. */
declare function reset(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print with a bold style. */
declare function bold(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print with a dimmed style. */
declare function dim(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print italicized. */
declare function italic(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print underlined. */
declare function underline(input: string | number | Path): string;
/** Wrap a string with ANSI control characters such that its foreground (text) and background colors are swapped. */
declare function inverse(input: string | number | Path): string;
/** Wrap a string with ANSI control characters such that it is hidden. */
declare function hidden(input: string | number | Path): string;
/** Wrap a string with the ANSI control characters that will make it print with a horizontal line through its center. */
declare function strikethrough(input: string | number | Path): string;
