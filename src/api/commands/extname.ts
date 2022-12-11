import { basename } from "./basename";

export function extname(
  pathOrFilename: string,
  options: { full?: boolean } = {}
): string {
  const filename = basename(pathOrFilename);
  const parts = filename.split(".");

  if (parts.length === 1) {
    return "";
  }

  if (options.full) {
    return "." + parts.slice(1).join(".");
  } else {
    return "." + parts[parts.length - 1];
  }
}
