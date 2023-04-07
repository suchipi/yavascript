/**
 * Styles templated strings using the provided functions.
 *
 * Accepts input strings containing content like:
 * ```ts
 * "red「this」 blue.italic「or」 dim「this」"
 * ```
 * and an object of functions with matching names:
 * ```ts
 * const functions = {
 *   red: (str) => '\e[31m' + str + '\e[39m',
 *   blue: (str) => '\e[34m' + str + '\e[39m',
 *   italic: (str) => '\e[3m' + str + '\e[23m',
 *   dim: (str) => '\e[2m' + str + '\e[22m',
 * }
 * ```
 * and returns a string containing content equivalent to if you had written:
 * ```ts
 * "\e[31mthis\e[39m \e[34m\e[3mor\e[23m\e[39m \e[2mthis\e[22m"
 * // Or:
 * functions.red("this") + " " + functions.blue(functions.italic("or")) + " " + functions.dim("this")
 * ```
 *
 * Note the special characters `「` and `」` which are used as delimiters.
 *
 * Also, note that nested `「」`s __are not supported__.
 *
 * @param input - The string with `「` and `」` characters in it.
 * @param functions - Functions to use to expand the template. This parameter is optional; if you don't pass any functions, an object containing all the formatting functions from the global scope (red, italic, bgBlue, dim, etc) will be used.
 */
declare function style(
  input: string,
  functions?: { [key: string]: (str: string) => string }
): string;
