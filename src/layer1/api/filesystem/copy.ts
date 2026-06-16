import * as std from "quickjs:std";
import * as os from "quickjs:os";
import { basename } from "../commands/basename";
import { Path } from "../path";
import { makeErrorWithProperties } from "../../error-with-properties";
import { logger } from "../logger";
import { ls } from "../commands/ls";
import { is } from "../is";
import { types } from "../types";
import { assert } from "../assert";
import { _getPathInfo } from "./_getPathInfo";
import { mkdir } from "../commands/mkdir";
import { appendSlashIfWindowsDriveLetter } from "../path/_win32Helpers";
import { pwd } from "../commands/pwd";
import { exists } from "./exists";

const noop = () => {};

function formatPath(path: Path | string): string {
  if (typeof path === "string") {
    path = new Path(path);
  }
  if (path.startsWith(pwd())) {
    return new Path(path).replace(pwd(), []).toString();
  } else if (path.startsWith(".")) {
    return new Path(path).replace(".", []).toString();
  } else {
    return path.toString();
  }
}

function copyRaw(
  from: string,
  to: string,
  trace: (...args: Array<any>) => void = logger.trace,
): void {
  from = appendSlashIfWindowsDriveLetter(from);
  to = appendSlashIfWindowsDriveLetter(to);

  let filesToCloseLater: Record<string, FILE> = {};
  let fdsToCloseLater: Record<string, number> = {};

  let fromStats: os.Stats | null = null;

  try {
    trace("opening", from, "(mode: rb)");
    const fromFile = std.open(from, "rb");
    filesToCloseLater[from] = fromFile;

    fromStats = os.stat(from);
    const fromPerms = fromStats.mode & (os.S_IRWXU | os.S_IRWXG | os.S_IRWXO);

    trace(
      "opening",
      to,
      `(flags: O_WRONLY | O_CREAT, mode: 0o${fromPerms.toString(8)})`,
    );
    const toFd = os.open(to, os.O_WRONLY | os.O_CREAT, fromPerms);
    fdsToCloseLater[to] = toFd;
    const toFile = std.fdopen(toFd, "w");
    filesToCloseLater[to] = toFile;

    const bufferSize = 16 * 1024 * 1024; // 16MB
    fromFile.writeTo(toFile, bufferSize);
  } catch (err) {
    trace("copyRaw failed:", { from, to, err });
    throw err;
  } finally {
    try {
      for (const [fileName, file] of Object.entries(filesToCloseLater)) {
        trace("closing", fileName);
        file.close();
      }
      filesToCloseLater = {};
    } catch (err) {
      trace("copyRaw failed to close a file:", { from, to, err });
    }

    try {
      for (const [fileName, fd] of Object.entries(fdsToCloseLater)) {
        trace("closing fd", fd, `(${fileName})`);
        os.close(fd);
      }
      fdsToCloseLater = {};
    } catch (err) {
      trace("copyRaw failed to close an fd:", { from, to, err });
      // ignored
    }

    if (fromStats != null) {
      try {
        // TODO: birth time, too. need crtime bindings from quickjs to do that
        os.utimes(to, fromStats.atime, fromStats.mtime);
      } catch (err) {
        trace("copyRaw failed to set access and modification times:", {
          from,
          to,
          err,
        });
        throw err;
      }
    }
  }
}

export type CopyOptions = {
  whenTargetExists?: "overwrite" | "skip" | "error";
  logging?: {
    trace?: (...args: Array<any>) => void;
    info?: (...args: Array<any>) => void;
  };
};

export function copy(
  from: string | Path,
  to: string | Path,
  options: CopyOptions = {},
): void {
  assert.type(
    from,
    types.or(types.string, types.Path),
    "'from' argument must be either a string or a Path object",
  );

  assert.type(
    to,
    types.or(types.string, types.Path),
    "'to' argument must be either a string or a Path object",
  );

  assert.type(
    options,
    types.or(types.undefined, types.anyObject),
    "when present, 'options' argument must be an object",
  );

  const {
    whenTargetExists = "error",
    logging: { trace = logger.trace, info = logger.info } = {},
  } = options;

  assert.type(
    whenTargetExists,
    types.or(
      types.exactString("overwrite"),
      types.exactString("skip"),
      types.exactString("error"),
    ),
    'when present, \'whenTargetExists\' option must be either "overwrite", "skip", or "error".',
  );

  assert.type(
    trace,
    types.or(types.undefined, types.anyFunction),
    "when present, 'logging.trace' option must be a function.",
  );

  assert.type(
    info,
    types.or(types.undefined, types.anyFunction),
    "when present, 'logging.info' option must be a function.",
  );

  if (is(to, types.Path)) {
    to = to.toString();
  }

  if (is(from, types.Path)) {
    from = from.toString();
  }

  if (!exists(from)) {
    throw new Error(`Source path does not exist: ${from}`);
  }

  const sourceInfo = _getPathInfo(from);
  const targetInfo = _getPathInfo(to);

  trace("copy requested", { from, to });

  switch (`${sourceInfo} -> ${targetInfo}`) {
    case "dir -> file": {
      // Invalid
      throw new Error(
        `Attempting to copy folder to path where file already exists: ${to}`,
      );
    }
    case "file -> dir": {
      // Copy file into dir
      const filename = basename(from);
      const target = new Path(to, filename).toString();
      info(`copy: ${formatPath(from)} -> ${formatPath(target)}`);
      copyRaw(from, target, trace);
      return;
    }
    case "file -> nonexistent": {
      // Copy to file at target path
      info(`copy: ${formatPath(from)} -> ${formatPath(to)}`);
      copyRaw(from, to, trace);
      return;
    }
    case "file -> file": {
      // Either overwrite, error, or skip, depending on whenTargetExists
      if (whenTargetExists === "error") {
        throw new Error(
          `File already exists: ${JSON.stringify(
            to,
          )}. To skip or overwrite existing files, pass 'whenTargetExists' as an option to 'copy', with a value of either "skip" or "overwrite".`,
        );
      } else if (whenTargetExists === "skip") {
        info(`copy: SKIPPING ${formatPath(from)} -> ${formatPath(to)}`);
        return;
      } else if (whenTargetExists === "overwrite") {
        info(`copy: OVERWRITING ${formatPath(from)} -> ${formatPath(to)}`);
        copyRaw(from, to, trace);
      } else {
        throw new Error(`Invalid whenTargetExists value: ${whenTargetExists}`);
      }
      return;
    }
    case "dir -> nonexistent": {
      // Create new dir at target path and copy contents into it recursively
      trace("ensuring dir", to);
      mkdir(to, { recursive: true, logging: { info: noop } });

      const children = ls(from);
      for (const child of children) {
        const filename = basename(child);
        const target = new Path(to, filename);
        copy(child, target, options);
      }
      return;
    }
    case "dir -> dir": {
      // Create new dir within target path and copy contents into it recursively
      const dirname = basename(from);
      const targetDir = new Path(to, dirname);
      trace("ensuring dir", targetDir);
      mkdir(targetDir, { recursive: true, logging: { info: noop } });

      const children = ls(from);
      for (const child of children) {
        const filename = basename(child);
        const target = new Path(targetDir, filename);
        copy(child, target, options);
      }
      return;
    }
    case "nonexistent -> nonexistent":
    case "nonexistent -> dir":
    case "nonexistent -> file": {
      throw makeErrorWithProperties("Attempting to copy a nonexistent file", {
        from,
        to,
      });
    }

    default: {
      throw new Error(
        `Unhandled situation in 'copy' function: ${JSON.stringify({
          sourceInfo,
          targetInfo,
          from,
          to,
        })}`,
      );
    }
  }
}
