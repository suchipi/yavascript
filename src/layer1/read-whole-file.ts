import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { ResizableBuffer } from "./resizable-buffer";

const MIN_CHUNK_SIZE = 64 * 1024;

// stat().size only means anything for regular files; on a pipe or fifo it
// reports whatever happens to be buffered, so the read has to loop to EOF.
export function readWholeFile(path: string): ArrayBuffer {
  let sizeHint = 0;
  try {
    sizeHint = os.stat(path).size;
  } catch {
    // only an allocation hint
  }

  const content = new ResizableBuffer(0);
  let offset = 0;

  const file = std.open(path, "rb");
  try {
    while (true) {
      const spaceLeft = content.buffer.byteLength - offset;
      if (spaceLeft === 0) {
        const grabBy = Math.max(sizeHint - offset, MIN_CHUNK_SIZE, offset);
        content.resizeBy(grabBy);
        continue;
      }

      const bytesRead = file.read(content.buffer, offset, spaceLeft);
      if (bytesRead <= 0) break;
      offset += bytesRead;
    }
  } finally {
    file.close();
  }

  return content.buffer.slice(0, offset);
}
