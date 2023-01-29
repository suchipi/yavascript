/**
 * Read the contents of one of more files from disk as one UTF-8 string,
 * print that string to stdout, then return it.
 */
declare function cat(...paths: Array<string | Path>): string;
