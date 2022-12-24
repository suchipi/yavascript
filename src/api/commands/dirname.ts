import { Path } from "../path";

export function dirname(path: string) {
  const separator = Path.detectSeparator(path);
  return Path.splitToSegments(path).slice(0, -1).join(separator);
}
