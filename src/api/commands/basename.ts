import { paths } from "../paths";

export function basename(path: string): string {
  const parts = paths.split(path);
  return parts[parts.length - 1];
}
