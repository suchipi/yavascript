import { bgBlue, white, bold, cyan, underline } from "../api/strings";

export function _mkText(name: string, link: string, additionalInfo?: string) {
  return (
    "\n  " +
    bold(bgBlue(white(" " + name + " "))) +
    "\n" +
    (additionalInfo ? "\n" + additionalInfo + "\n" : "") +
    "\n" +
    (additionalInfo ? "For more info, see " : "See ") +
    cyan(underline(link)) +
    ".\n"
  );
}
