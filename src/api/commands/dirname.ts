import { paths } from "../paths";

export function dirname(path: string) {
  const separator = paths.detectSeparator(path);
  return paths.split(path).slice(0, -1).join(separator);
}
