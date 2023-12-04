/**
 * Create a directory (folder).
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare function mkdir(
  path: string | Path,
  options?: {
    recursive?: boolean;
    mode?: number;
    logging?: {
      trace?: (...args: Array<any>) => void;
      info?: (...args: Array<any>) => void;
    };
  }
): void;
