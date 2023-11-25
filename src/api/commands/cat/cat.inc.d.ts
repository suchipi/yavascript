/**
 * Reads the contents of one or more files from disk as either one UTF-8 string
 * or one ArrayBuffer.
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
