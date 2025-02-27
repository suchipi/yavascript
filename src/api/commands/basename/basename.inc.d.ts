/**
 * Return the last component of a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > Example: `basename("/home/suchipi/something")` returns `"something"`, the last part.
 */
declare function basename(path: string | Path): string;
