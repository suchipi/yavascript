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
  | ArrayBuffer
  | SharedArrayBuffer
  | DataView
  | FILE
  | ArrayBufferConstructor
  | SharedArrayBufferConstructor
  | DataViewConstructor
  | TypedArrayConstructor
  | StringConstructor
  | DataViewConstructor
  | { path: string }
  | { fd: number };

/**
 * Copy data from one source into the given target. Returns the number of bytes
 * written, and the target that data was written into.
 *
 * NOTE: If the target is a {@link FILE}, *including if it was created by
 * calling this function with `path` or `fd`*, it will NOT be closed by this
 * function. You need to close it yourself.
 */
export interface Pipe {
  /**
   * Copy data from one source into the given target. Returns the number of bytes
   * written, and the target that data was written into.
   *
   * NOTE: If the target is a {@link FILE}, *including if it was created by
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
   * NOTE: If the target is a {@link FILE}, *including if it was created by
   * calling this function with `path` or `fd`*, it will NOT be closed by this
   * function. You need to close it yourself.
   */
  (from: PipeSource, to: { fd: number }): {
    bytesTransferred: number;
    target: FILE;
  };

  /**
   * Copy data from one source into the given target. Returns the number of bytes
   * written, and the target that data was written into.
   *
   * NOTE: If the target is a {@link FILE}, *including if it was created by
   * calling this function with `path` or `fd`*, it will NOT be closed by this
   * function. You need to close it yourself.
   */
  <Dest extends PipeDestination>(from: PipeSource, to: Dest): {
    bytesTransferred: number;
    target: Dest extends ArrayBuffer | SharedArrayBuffer | DataView | FILE
      ? Dest
      : Dest extends
          | ArrayBufferConstructor
          | SharedArrayBufferConstructor
          | DataViewConstructor
          | TypedArrayConstructor
          | DataViewConstructor
      ? Dest["prototype"]
      : Dest extends StringConstructor
      ? string
      : never;
  };
}

declare const pipe: Pipe;
