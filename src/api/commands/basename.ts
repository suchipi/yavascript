import { Path } from "../path";

export function basename(path: string): string {
  const parts = Path.splitToSegments(path);
  return parts[parts.length - 1];
}
