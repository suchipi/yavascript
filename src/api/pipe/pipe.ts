import * as std from "quickjs:std";
import { TypedArray, TypedArrayConstructor, byte } from "../others";
import { is } from "../is";
import { types } from "../types";
import { makeErrorWithProperties } from "../../error-with-properties";
import type { Path } from "../path";

export type PipeSource =
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
  | { data: FILE; maxLength?: number; until?: string | byte }
  | Path
  | { path: Path | string; maxLength?: number; until?: string | byte }
  | { fd: number; maxLength?: number; until?: string | byte };

type Readable = {
  read(): byte | null;
  close(): void;
};

function getReadable(from: PipeSource): Readable {
  let source:
    | ArrayBuffer
    | SharedArrayBuffer
    | TypedArray
    | DataView
    | FILE
    | string
    | null = null;

  let maxLength = Infinity;
  let until: byte | null = null;

  let shouldCloseFile = false;

  if (is(from, types.string)) {
    throw new Error(
      "It is ambiguous whether you want to read from the string's contents or from the file at the path contained within the string. Pass an object with a 'data' or 'path' property, instead."
    );
  }

  if (is(from, Object)) {
    if (is(from.maxLength, Number)) {
      maxLength = from.maxLength;
    }

    if (is(from.until, String)) {
      if (from.until.length !== 1) {
        const received = from.until;
        throw makeErrorWithProperties(
          "Only single-byte strings or integers from 0 to 255 may be used as 'until'",
          { received }
        );
      }

      until = from.until.charCodeAt(0) as byte;
    }

    if (is(from.until, Number)) {
      const isInteger = from.until % 1 === 0;
      if (from.until < 0 || !isInteger || from.until > 255) {
        const received = from.until;
        throw makeErrorWithProperties(
          "Only single-byte strings or integers from 0 to 255 may be used as 'until'",
          { received }
        );
      }

      until = from.until as byte;
    }

    if ((from as any).data != null) {
      source = (from as any).data;
    } else if ((from as any).path != null) {
      const path = (from as any).path;
      if (is(path, types.string)) {
        source = std.open(path, "rb");
        shouldCloseFile = true;
      } else if (is(path, types.Path)) {
        source = std.open(path.toString(), "rb");
        shouldCloseFile = true;
      } else {
        throw makeErrorWithProperties(
          "'path' property on PipeSource must be either a string or Path",
          { path }
        );
      }
    } else if (typeof (from as any).fd === "number") {
      source = std.fdopen((from as any).fd, "rb");
      shouldCloseFile = true;
    } else if (is(from, types.Path)) {
      source = std.open(from.toString(), "rb");
      shouldCloseFile = true;
    } else {
      source = from as any;
    }
  }

  if (source == null) {
    throw makeErrorWithProperties("Invalid argument", { from });
  }

  if (
    is(source, types.TypedArray) ||
    is(source, ArrayBuffer) ||
    is(source, SharedArrayBuffer) ||
    is(source, DataView)
  ) {
    const view = is(source, DataView)
      ? source
      : is(source, types.TypedArray)
      ? new DataView(source.buffer)
      : new DataView(source);

    let offset = 0;
    let reachedUntil = false;

    return {
      close() {},
      read() {
        if (
          offset === view.byteLength ||
          offset === maxLength ||
          reachedUntil
        ) {
          return null;
        }

        const byte = view.getUint8(offset);
        offset++;

        if (until !== null && byte === until) {
          reachedUntil = true;
        }

        return byte as byte;
      },
    };
  } else if (is(source, types.FILE)) {
    const file = source as FILE;

    let offset = 0;
    let reachedUntil = false;
    return {
      close() {
        if (shouldCloseFile) {
          file.close();
        }
      },
      read() {
        if (offset === maxLength || reachedUntil) {
          return null;
        }

        const byte = file.getByte();
        offset++;
        if (byte === -1) {
          return null;
        }

        if (until !== null && byte === until) {
          reachedUntil = true;
        }

        return byte as byte;
      },
    };
  } else if (typeof source === "string") {
    const str = source as string;

    let offset = 0;
    let reachedUntil = false;
    return {
      close() {},
      read() {
        if (offset === maxLength || reachedUntil) {
          return null;
        }

        const byte = str.charCodeAt(offset);
        offset++;
        if (is(byte, NaN)) {
          return null;
        }

        if (until !== null && byte === until) {
          reachedUntil = true;
        }

        return byte as byte;
      },
    };
  } else {
    throw makeErrorWithProperties("Invalid readable source", { from });
  }
}

export type PipeDestination =
  | ArrayBuffer
  | SharedArrayBuffer
  | DataView
  | TypedArray
  | Path
  | FILE
  | ArrayBufferConstructor
  | SharedArrayBufferConstructor
  | DataViewConstructor
  | TypedArrayConstructor
  | StringConstructor
  | { path: string }
  | { fd: number };

function resizeBuffer<BufferType extends ArrayBuffer | SharedArrayBuffer>(
  inputBuffer: BufferType,
  newSize: number
): BufferType {
  const newBuffer = is(inputBuffer, ArrayBuffer)
    ? new ArrayBuffer(newSize)
    : new SharedArrayBuffer(newSize);
  const oldView = new DataView(inputBuffer);
  const newView = new DataView(newBuffer);

  const byteCount = Math.min(newSize, inputBuffer.byteLength);
  for (let i = 0; i < byteCount; i++) {
    newView.setUint8(i, oldView.getUint8(i));
  }
  return newBuffer as any;
}

// TODO: support write of more than one byte at a time, to make things way faster
type Writable = {
  // Returns whether the byte was written; if it wasn't, it means some sort of
  // limit was hit (max length, etc).
  write(byte: byte): boolean;
  result(): any;
};

function getWritable(to: PipeDestination): Writable {
  if (!(is(to, Object) || is(to, Function))) {
    throw makeErrorWithProperties(
      "'to' must be a function or object, but received something else",
      { to }
    );
  }

  const filesToClose: Array<FILE> = [];

  try {
    let target: any;

    if (is(to, types.Path)) {
      const file = std.open(to.toString(), "w");
      filesToClose.push(file);
      target = file;
    } else if (is((to as any).path, string)) {
      const file = std.open((to as any).path, "w");
      filesToClose.push(file);
      target = file;
    } else if (is((to as any).fd, number)) {
      const file = std.fdopen((to as any).fd, "w");
      filesToClose.push(file);
      target = file;
    } else {
      target = to;
    }

    if (
      is(target, ArrayBuffer) ||
      is(target, SharedArrayBuffer) ||
      is(target, DataView) ||
      is(target, types.TypedArray)
    ) {
      let offset = 0;
      let limit = target.byteLength;

      const view = is(target, DataView)
        ? target
        : is(target, types.TypedArray)
        ? new DataView(target.buffer)
        : new DataView(target);

      return {
        write(byte: byte): boolean {
          if (offset === limit) {
            return false;
          }
          view.setUint8(offset, byte);
          offset++;
          return true;
        },
        result() {
          return target;
        },
      };
    } else if (is(target, types.FILE)) {
      return {
        write(byte: byte): boolean {
          try {
            target.putByte(byte);
            return true;
          } catch {
            return false;
          }
        },
        result() {
          for (const file of filesToClose) {
            file.close();
          }
          if (filesToClose.length > 0) {
            return to;
          } else {
            return target;
          }
        },
      };
    } else if (is(to, Function)) {
      const targetConstructor: any = to;
      switch (targetConstructor) {
        case String: {
          let target = "";

          return {
            write(byte: byte): boolean {
              target += String.fromCharCode(byte);
              return true;
            },
            result() {
              return target;
            },
          };
        }
        default: {
          let offset = 0;
          let buffer =
            targetConstructor === SharedArrayBuffer
              ? new SharedArrayBuffer(0)
              : new ArrayBuffer(0);
          let view = new DataView(buffer);

          return {
            write(byte: byte): boolean {
              if (offset === buffer.byteLength) {
                buffer = resizeBuffer(
                  buffer,
                  Math.max(buffer.byteLength, 1) * 2
                );
                view = new DataView(buffer);
              }

              view.setUint8(offset, byte);
              offset++;
              return true;
            },
            result() {
              switch (targetConstructor) {
                case ArrayBuffer:
                case SharedArrayBuffer: {
                  buffer = resizeBuffer(buffer, offset);
                  return buffer;
                }
                case DataView: {
                  return view;
                }
                // String is not reachable here because it was handled in an
                // earlier switch statement
                default: {
                  buffer = resizeBuffer(buffer, offset);
                  return new (targetConstructor as TypedArrayConstructor)(
                    buffer
                  );
                }
              }
            },
          };
        }
      }
    } else {
      throw makeErrorWithProperties("Invalid argument", { to });
    }
  } catch (err) {
    for (const file of filesToClose) {
      file.close();
    }
    throw err;
  }

  // Shouldn't be possible to get here, but...
  throw makeErrorWithProperties("Internal error: Unhandled destination", {
    to,
  });
}

// TODO: child process stdio should be pipeable; would need to introduce child
// type to return from exec
export const pipe = <Dest extends PipeDestination>(
  from: PipeSource,
  to: Dest
): {
  bytesTransferred: number;
  target: Dest extends
    | ArrayBuffer
    | SharedArrayBuffer
    | DataView
    | FILE
    | { path: string }
    | { fd: number }
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
} => {
  const readable = getReadable(from);
  const writable = getWritable(to);

  let bytesTransferred = 0;
  let byte: byte | null;
  while (((byte = readable.read()), byte != null)) {
    const wrote = writable.write(byte);
    if (!wrote) break;
    bytesTransferred++;
  }
  readable.close();

  return { bytesTransferred, target: writable.result() };
};
