/**
 * Returns the contents of a directory, as absolute paths. `.` and `..` are
 * omitted.
 */
declare function ls(dir?: string | Path): Array<Path>;
