/**
 * Get the absolute path given a relative path. Symlinks are also resolved.
 *
 * The path's target file/directory must exist.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > If you want to convert a relative path to an absolute path, but the path's
 * > target might NOT exist, use {@link Path.normalize}.
 */
declare function realpath(path: string | Path): Path;
