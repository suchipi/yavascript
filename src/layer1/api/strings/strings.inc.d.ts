/**
 * Removes ANSI control characters from a string.
 *
 * **Example**
 * ```ts
 * const plain = stripAnsi(red("error"));
 * console.log(plain.length);
 * ```
 */
declare function stripAnsi(input: string | number | Path): string;

/**
 * Wraps a string in double quotes, and escapes any double-quotes inside using `\"`.
 *
 * **Example**
 * ```ts
 * console.log(quote('She said "hi"'));
 * ```
 */
declare function quote(input: string | number | Path): string;

// Colors

/**
 * Wraps a string with the ANSI control characters that will make it print as black text.
 *
 * **Example**
 * ```ts
 * console.log(bgWhite(black("dark text on a light background")));
 * ```
 */
declare function black(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as red text.
 *
 * **Example**
 * ```ts
 * console.error(red("Error: file not found"));
 * ```
 */
declare function red(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as green text.
 *
 * **Example**
 * ```ts
 * console.log(green("All tests passed"));
 * ```
 */
declare function green(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as yellow text.
 *
 * **Example**
 * ```ts
 * console.warn(yellow("Warning: config file is missing"));
 * ```
 */
declare function yellow(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as blue text.
 *
 * **Example**
 * ```ts
 * console.log(blue("Downloading dependencies..."));
 * ```
 */
declare function blue(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as magenta text.
 *
 * **Example**
 * ```ts
 * console.log(magenta("Deploying to production"));
 * ```
 */
declare function magenta(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as cyan text.
 *
 * **Example**
 * ```ts
 * console.log(cyan("https://example.com"));
 * ```
 */
declare function cyan(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as white text.
 *
 * **Example**
 * ```ts
 * console.log(bgBlue(white("light text on a dark background")));
 * ```
 */
declare function white(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as gray text. (Alias for {@link grey}.)
 *
 * **Example**
 * ```ts
 * console.log(gray("(skipped 3 files)"));
 * ```
 */
declare function gray(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print as grey text. (Alias for {@link gray}.)
 *
 * **Example**
 * ```ts
 * console.log(grey("(skipped 3 files)"));
 * ```
 */
declare function grey(input: string | number | Path): string;

// Background Colors

/**
 * Wraps a string with the ANSI control characters that will make it have a black background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgBlack(white(" README.md ")));
 * ```
 */
declare function bgBlack(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it have a red background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgRed(" FAIL "), "tests/math.test.ts");
 * ```
 */
declare function bgRed(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it have a green background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgGreen(" PASS "), "tests/math.test.ts");
 * ```
 */
declare function bgGreen(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it have a yellow background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgYellow(black(" WARN ")), "deprecated option");
 * ```
 */
declare function bgYellow(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it have a blue background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgBlue(" INFO "), "server started");
 * ```
 */
declare function bgBlue(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it have a magenta background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgMagenta(" DEBUG "), "cache miss");
 * ```
 */
declare function bgMagenta(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it have a cyan background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgCyan(black(" NOTE ")), "using default config");
 * ```
 */
declare function bgCyan(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it have a white background when printed.
 *
 * **Example**
 * ```ts
 * console.log(bgWhite(black(" v1.0.0 ")));
 * ```
 */
declare function bgWhite(input: string | number | Path): string;

// Modifiers

/**
 * Prefixes a string with the ANSI control character that resets all styling.
 *
 * **Example**
 * ```ts
 * console.log(reset("plain text with no styling"));
 * ```
 */
declare function reset(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print with a bold style.
 *
 * **Example**
 * ```ts
 * console.log(bold("Important:"), "read this first");
 * ```
 */
declare function bold(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print with a dimmed style.
 *
 * **Example**
 * ```ts
 * console.log(dim("last updated 3 days ago"));
 * ```
 */
declare function dim(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print italicized.
 *
 * **Example**
 * ```ts
 * console.log(italic("emphasis"));
 * ```
 */
declare function italic(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print underlined.
 *
 * **Example**
 * ```ts
 * console.log(underline("https://example.com"));
 * ```
 */
declare function underline(input: string | number | Path): string;

/**
 * Wraps a string with ANSI control characters that will make it print with its foreground (text) and background colors swapped.
 *
 * **Example**
 * ```ts
 * console.log(inverse(" selected item "));
 * ```
 */
declare function inverse(input: string | number | Path): string;

/**
 * Wraps a string with ANSI control characters that will make it print as hidden.
 *
 * **Example**
 * ```ts
 * console.log("password:", hidden("hunter2"));
 * ```
 */
declare function hidden(input: string | number | Path): string;

/**
 * Wraps a string with the ANSI control characters that will make it print with a horizontal line through its center.
 *
 * **Example**
 * ```ts
 * console.log(strikethrough("buy milk"));
 * ```
 */
declare function strikethrough(input: string | number | Path): string;
