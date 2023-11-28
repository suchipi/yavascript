/**
 * Searches the system for the path to a program named `binaryName`.
 *
 * If the program can't be found, `null` is returned.
 *
 * @param binaryName The program to search for
 * @param options Options which affect how the search is performed
 * @param options.searchPaths A list of folders where programs may be found. Defaults to `env.PATH?.split(Path.OS_ENV_VAR_SEPARATOR) || []`.
 * @param options.suffixes A list of filename extension suffixes to include in the search, ie [".exe"]. Defaults to `Path.OS_PROGRAM_EXTENSIONS`.
 * @param options.trace A logging function that will be called at various times during the execution of `which`. Defaults to {@link logger.trace}.
 */
declare function which(
  binaryName: string,
  options?: {
    searchPaths?: Array<Path | string>;
    suffixes?: Array<string>;
    trace?: (...args: Array<any>) => void;
  }
): Path | null;
