/**
 * Returns the contents of a directory, as absolute paths. `.` and `..` are
 * omitted.
 *
 * If `ls()` is called with no directory, the present working directory
 * (`pwd()`) is used.
 */
declare function ls(dir?: string | Path): Array<Path>;
