/**
 * The data source of a pipe operation; either an in-memory object, or a
 * file stream.
 *
 * - Use `maxLength` to limit how much data to read.
 * - Use `until` to stop reading once a certain byte or character has been
 *   read.
 * - Use `path` or `fd` to open a file.
 */
declare type PipeSource =
  | { data: string; maxLength?: number; until?: string | byte }
  | ArrayBuffer
  | { data: ArrayBuffer; maxLength?: number; until?: string | byte }
  | SharedArrayBuffer
  | { data: SharedArrayBuffer; maxLength?: number; until?: string | byte }
  | TypedArray
  | { data: TypedArray; maxLength?: number; until?: string | byte }
  | DataView
  | { data: DataView; maxLength?: number; until?: string | byte }
  | FILE
  | {
      data: FILE;
      maxLength?: number;
      until?: string | byte;
    }
  | { path: string; maxLength?: number; until?: string | byte }
  | { fd: number; maxLength?: number; until?: string | byte };

/**
 * The target destination of a pipe operation; either an in-memory object, or a
 * file stream.
 *
 * - Use `intoExisting` to put data into an existing object or file handle.
 * - Use `intoNew` to put data into a new object.
 * - Use `path` or `fd` to create a new file handle and put data into it.
 */
export type PipeDestination =
  | { intoExisting: ArrayBuffer | SharedArrayBuffer | DataView | FILE }
  | {
      intoNew:
        | ArrayBufferConstructor
        | SharedArrayBufferConstructor
        | DataViewConstructor
        | TypedArrayConstructor
        | StringConstructor
        | DataViewConstructor;
    }
  | { path: string }
  | { fd: number };

/**
 * Copy data from one source into the given target. Returns the number of bytes
 * written, and the target that data was written into.
 *
 * NOTE: If the target is a {@link std.FILE}, *including if it was created by
 * calling this function with `path` or `fd`*, it will NOT be closed by this
 * function. You need to close it yourself.
 */
declare interface Pipe {
  /**
   * Copy data from one source into the given target. Returns the number of bytes
   * written, and the target that data was written into.
   *
   * NOTE: If the target is a {@link std.FILE}, *including if it was created by
   * calling this function with `path` or `fd`*, it will NOT be closed by this
   * function. You need to close it yourself.
   */
  <Target>(from: PipeSource, to: PipeDestination & { intoExisting: Target }): {
    bytesTransferred: number;
    target: Target;
  };

  /**
   * Copy data from one source into the given target. Returns the number of bytes
   * written, and the target that data was written into.
   *
   * NOTE: If the target is a {@link std.FILE}, *including if it was created by
   * calling this function with `path` or `fd`*, it will NOT be closed by this
   * function. You need to close it yourself.
   */
  <Target>(
    from: PipeSource,
    to: PipeDestination & { intoExisting: { new (...args: any): Target } }
  ): { bytesTransferred: number; target: Target };

  /**
   * Copy data from one source into the given target. Returns the number of bytes
   * written, and the target that data was written into.
   *
   * NOTE: If the target is a {@link std.FILE}, *including if it was created by
   * calling this function with `path` or `fd`*, it will NOT be closed by this
   * function. You need to close it yourself.
   */
  (from: PipeSource, to: { path: string }): {
    bytesTransferred: number;
    target: FILE;
  };

  /**
   * Copy data from one source into the given target. Returns the number of bytes
   * written, and the target that data was written into.
   *
   * NOTE: If the target is a {@link std.FILE}, *including if it was created by
   * calling this function with `path` or `fd`*, it will NOT be closed by this
   * function. You need to close it yourself.
   */
  (from: PipeSource, to: { fd: number }): {
    bytesTransferred: number;
    target: FILE;
  };
}

declare const pipe: Pipe;
