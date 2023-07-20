import * as os from "quickjs:os";

const WIN32_DRIVE_LETTER_REGEXP = /^[A-Za-z]:$/;

export function appendSlashIfWindowsDriveLetter(pathString: string): string {
  if (os.platform === "win32" && WIN32_DRIVE_LETTER_REGEXP.test(pathString)) {
    return pathString + Path.OS_SEGMENT_SEPARATOR;
  } else {
    return pathString;
  }
}
