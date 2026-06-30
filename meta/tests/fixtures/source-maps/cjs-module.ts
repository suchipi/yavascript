type T = number;
const double = (n: T): T => n * 2;
function boom(): void {
  throw new Error("cjs-ts-boom");
}
exports.boom = boom;
