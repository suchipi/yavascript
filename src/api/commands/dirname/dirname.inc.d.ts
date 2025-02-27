/**
 * Removes the final component from a path string.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > Example: `dirname("/home/suchipi/something")` returns
 * > `"/home/suchipi"`, everything except the last part.
 */
declare function dirname(path: string | Path): Path;
