import { Path } from "../path";

const WIN32_DRIVE_LETTER_REGEXP = /^[A-Za-z]:$/;

export function appendSlashIfWindowsDriveLetter(pathString: string): string {
  if (WIN32_DRIVE_LETTER_REGEXP.test(pathString)) {
    return pathString + Path.OS_SEGMENT_SEPARATOR;
  } else {
    return pathString;
  }
}
