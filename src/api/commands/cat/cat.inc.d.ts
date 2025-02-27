/**
 * Reads the contents of one or more files from disk as either one UTF-8 string
 * or one ArrayBuffer.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * > Example: If you have a file called `hi.txt` in the current working
 * > directory, and it contains the text "hello", running `cat("hi.txt")`
 * > returns `"hello"`.
 */
declare const cat: {
  /**
   * Read the contents of one or more files from disk, as one UTF-8 string.
   */
  (paths: string | Path | Array<string | Path>): string;

  /**
   * Read the contents of one or more files from disk, as one UTF-8 string.
   */
  (paths: string | Path | Array<string | Path>, options: {}): string;

  /**
   * Read the contents of one or more files from disk, as one UTF-8 string.
   */
  (
    paths: string | Path | Array<string | Path>,
    options: { binary: false }
  ): string;

  /**
   * Read the contents of one or more files from disk, as one ArrayBuffer.
   */
  (
    paths: string | Path | Array<string | Path>,
    options: { binary: true }
  ): ArrayBuffer;
};
