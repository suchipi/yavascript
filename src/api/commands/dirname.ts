import { Path } from "../path";
import { is } from "../is";

export function dirname(path: string | Path) {
  let pathObj: Path;

  if (is(path, types.Path)) {
    pathObj = path.clone();
  } else if (is(path, types.string)) {
    pathObj = new Path(path);
  } else {
    throw new TypeError(
      "'path' argument must be either a string or a Path object"
    );
  }

  pathObj.segments.pop();

  return pathObj.toString();
}
