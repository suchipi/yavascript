export class ResizableBuffer {
  buffer: ArrayBuffer;

  constructor(byteLength: number) {
    this.buffer = new ArrayBuffer(byteLength);
  }

  resizeTo(byteLength: number) {
    this.resizeBy(byteLength - this.buffer.byteLength);
  }

  resizeBy(bytes: number) {
    if (bytes === 0) {
      return;
    }

    if (bytes < 0) {
      this.buffer = this.buffer.slice(0, -bytes);
    } else {
      const newBuffer = new ArrayBuffer(this.buffer.byteLength + bytes);
      new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
      this.buffer = newBuffer;
    }

    return this.buffer;
  }
}
