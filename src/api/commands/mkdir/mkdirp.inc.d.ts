/**
 * Create a directory (folder) and all parents, recursively
 *
 * Alias for `mkdir(path, { recursive: true })`.
 *
 * Provides the same functionality as `mkdir -p`.
 */
declare function mkdirp(path: string | Path, options?: { mode?: number }): void;
