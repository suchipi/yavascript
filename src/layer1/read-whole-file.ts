import * as std from "quickjs:std";
import * as os from "quickjs:os";

const CHUNK_SIZE = 64 * 1024;

function readRest(file: FILE): ArrayBuffer {
  let buffer = new ArrayBuffer(CHUNK_SIZE);
  let filled = 0;

  while (true) {
    if (filled === buffer.byteLength) {
      const grown = new ArrayBuffer(buffer.byteLength * 2);
      new Uint8Array(grown).set(new Uint8Array(buffer));
      buffer = grown;
    }

    const bytesRead = file.read(buffer, filled, buffer.byteLength - filled);
    if (bytesRead <= 0) break;
    filled += bytesRead;
  }

  return filled === buffer.byteLength ? buffer : buffer.slice(0, filled);
}

// stat().size only describes a regular file. On a pipe or fifo it reports
// whatever happens to be buffered at that instant, so a read sized from it
// silently truncates.
export function readWholeFile(path: string): ArrayBuffer {
  let size = 0;
  try {
    size = os.stat(path).size;
  } catch {}

  const file = std.open(path, "rb");
  try {
    if (size <= 0) {
      return readRest(file);
    }

    const buffer = new ArrayBuffer(size);
    let filled = 0;
    while (filled < size) {
      const bytesRead = file.read(buffer, filled, size - filled);
      if (bytesRead <= 0) break;
      filled += bytesRead;
    }

    if (filled < size) {
      return buffer.slice(0, filled);
    }

    // A regular file ends here, with the one buffer and no copying. Anything
    // still readable means the reported size wasn't the whole story.
    const rest = readRest(file);
    if (rest.byteLength === 0) {
      return buffer;
    }

    const combined = new ArrayBuffer(buffer.byteLength + rest.byteLength);
    const view = new Uint8Array(combined);
    view.set(new Uint8Array(buffer));
    view.set(new Uint8Array(rest), buffer.byteLength);
    return combined;
  } finally {
    file.close();
  }
}
