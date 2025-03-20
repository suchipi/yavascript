import { mkdir } from "./mkdir";
import type { Path } from "../../path";

export function mkdirp(
  path: string | Path,
  options?: {
    mode?: number;
    logging?: {
      trace?: (...args: Array<any>) => void;
      info?: (...args: Array<any>) => void;
    };
  }
): void {
  mkdir(path, { ...options, recursive: true });
}
