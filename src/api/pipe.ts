import * as std from "std";
import { TypedArray, TypedArrayConstructor } from "./typed-array";
import { byte } from "./byte";
import { is } from "./is";
import * as inspectOptions from "../inspect-options";

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
  | { path: string; maxLength?: number; until?: string | byte }
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

  if (is.string(from)) {
    throw new Error(
      "It is ambiguous whether you want to read from the string's contents or from the file at the path contained within the string. Pass an object with a 'data' or 'path' property, instead."
    );
  }

  if (is.object(from)) {
    if (is.number(from.maxLength)) {
      maxLength = from.maxLength;
    }

    if (is.string(from.until)) {
      if (from.until.length !== 1) {
        const received = from.until;
        const err = new Error(
          `Only single-byte strings or integers from 0 to 255 may be used as 'until' (received = ${received})`
        );
        Object.assign(err, { received });
        throw err;
      }

      until = from.until.charCodeAt(0) as byte;
    }

    if (is.number(from.until)) {
      const isInteger = from.until % 1 === 0;
      if (from.until < 0 || !isInteger || from.until > 255) {
        const received = from.until;
        const err = new Error(
          `Only single-byte strings or integers from 0 to 255 may be used as 'until' (received = ${received})`
        );
        Object.assign(err, { received });
        throw err;
      }

      until = from.until as byte;
    }

    if ((from as any).data != null) {
      source = (from as any).data;
    } else if (typeof (from as any).path === "string") {
      source = std.open((from as any).path, "rb");
      shouldCloseFile = true;
    } else if (typeof (from as any).fd === "number") {
      source = std.fdopen((from as any).fd, "rb");
      shouldCloseFile = true;
    } else {
      source = from as any;
    }
  }

  if (source == null) {
    const err = new Error(
      `Invalid argument (from = ${inspect(
        from,
        inspectOptions.forError
      ).replace(/\n+/g, " ")})`
    );
    Object.assign(err, { from });
    throw err;
  }

  if (
    is.TypedArray(source) ||
    is.ArrayBuffer(source) ||
    is.SharedArrayBuffer(source) ||
    is.DataView(source)
  ) {
    const view = is.DataView(source)
      ? source
      : is.TypedArray(source)
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
  } else if (is.FILE(source)) {
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
        if (is.NaN(byte)) {
          return null;
        }

        if (until !== null && byte === until) {
          reachedUntil = true;
        }

        return byte as byte;
      },
    };
  } else {
    const err = new Error(
      `Invalid readable source (from = ${inspect(
        from,
        inspectOptions.forError
      ).replace(/\n+/g, " ")}))`
    );
    Object.assign(err, { from });
    throw err;
  }
}

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

function resizeBuffer<BufferType extends ArrayBuffer | SharedArrayBuffer>(
  inputBuffer: BufferType,
  newSize: number
): BufferType {
  const newBuffer = is.ArrayBuffer(inputBuffer)
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

type Writable = {
  // Returns whether the byte was written; if it wasn't, it means some sort of
  // limit was hit (max length, etc).
  write(byte: byte): boolean;
  result(): any;
};

function getWritable(to: PipeDestination): Writable {
  if (!(is.object(to) || is.function(to))) {
    const err = new Error(`Invalid argument (to = ${to})`);
    Object.assign(err, { to });
    throw err;
  }

  const filesToClose: Array<FILE> = [];

  try {
    let target: any;

    if (is.string((to as any).path)) {
      const file = std.open((to as any).path, "w");
      filesToClose.push(file);
      target = file;
    } else if (is.number((to as any).fd)) {
      const file = std.fdopen((to as any).fd, "w");
      filesToClose.push(file);
      target = file;
    } else if (
      is.ArrayBuffer(to) ||
      is.SharedArrayBuffer(to) ||
      is.DataView(to) ||
      is.FILE(to)
    ) {
      target = to;
      if (
        is.ArrayBuffer(target) ||
        is.SharedArrayBuffer(target) ||
        is.DataView(target)
      ) {
        let offset = 0;
        let limit = target.byteLength;

        const view = is.DataView(target) ? target : new DataView(target);

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
            if (!is.DataView(target)) {
              return resizeBuffer(target, offset);
            }
            return target;
          },
        };
      } else if (is.FILE(target)) {
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
            return target;
          },
        };
      }
    } else if (is.function(to)) {
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
      const err = new Error(`Invalid argument (to = ${to})`);
      Object.assign(err, { to });
      throw err;
    }
  } catch (err) {
    for (const file of filesToClose) {
      file.close();
    }
    throw err;
  }

  // Shouldn't be possible to get here, but...
  const err = new Error(`Internal error: Unhandled destination (to = ${to})`);
  Object.assign(err, { to });
  throw err;
}

export interface Pipe {
  (from: PipeSource, to: { path: string }): {
    bytesTransferred: number;
    target: FILE;
  };
  (from: PipeSource, to: { fd: number }): {
    bytesTransferred: number;
    target: FILE;
  };

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

// TODO: child process stdio should be pipeable; would need to introduce child
// type to return from exec
//
// TODO: doesn't seem to handle null character within string properly
//
// TODO: close created fds by default, like source does (if you want unclosed, open them yourself)
export const pipe: Pipe = (
  from: PipeSource,
  to: PipeDestination
): { bytesTransferred: number; target: any } => {
  const readable = getReadable(from);
  const writable = getWritable(to);

  let bytesTransferred = 0;
  let byte: byte | null;
  while ((byte = readable.read())) {
    const wrote = writable.write(byte);
    if (!wrote) break;
    bytesTransferred++;
  }
  readable.close();

  return { bytesTransferred, target: writable.result() };
};
