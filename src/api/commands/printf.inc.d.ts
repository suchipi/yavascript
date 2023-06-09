/**
 * Print data to stdout using C-style format specifiers.
 *
 * The same formats as the standard C library printf are supported. Integer
 * format types (e.g. `%d`) truncate the Numbers or BigInts to 32 bits. Use the l
 * modifier (e.g. `%ld`) to truncate to 64 bits.
 */
declare function printf(format: string, ...args: Array<any>): void;
