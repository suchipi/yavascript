export class AssertionError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.stack = this.stack!.split("\n").slice(3).join("\n");
    this.name = "AssertionError";
  }
}
