import { Path } from "../../path";
import { is } from "../../is";

export function dirname(path: string | Path): Path {
  let pathObj: Path;

  if (is(path, types.Path)) {
    pathObj = path;
  } else if (is(path, types.string)) {
    pathObj = new Path(path);
  } else {
    throw new TypeError(
      "'path' argument must be either a string or a Path object"
    );
  }

  return pathObj.dirname();
}
