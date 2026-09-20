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
import { isLink } from "./isLink";

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
  let copySucceeded = false;

  try {
    trace("opening", from, "(mode: rb)");
    const fromFile = std.open(from, "rb");
    filesToCloseLater[from] = fromFile;

    fromStats = os.stat(from);
    const fromPerms = fromStats.mode & (os.S_IRWXU | os.S_IRWXG | os.S_IRWXO);

    trace(
      "opening",
      to,
      `(flags: O_WRONLY | O_CREAT | O_TRUNC, mode: 0o${fromPerms.toString(8)})`,
    );
    const toFd = os.open(
      to,
      os.O_WRONLY | os.O_CREAT | os.O_TRUNC,
      fromPerms,
    );
    fdsToCloseLater[to] = toFd;
    const toFile = std.fdopen(toFd, "w");
    filesToCloseLater[to] = toFile;

    const bufferSize = 16 * 1024 * 1024; // 16MB
    fromFile.writeTo(toFile, bufferSize);
    copySucceeded = true;
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

    if (copySucceeded && fromStats != null) {
      try {
        // TODO: birth time, too. need crtime bindings from quickjs to do that
        os.utimes(to, fromStats.atime, fromStats.mtime);
      } catch (err) {
        // Throwing here would replace whatever the copy itself threw.
        trace("copyRaw failed to set access and modification times:", {
          from,
          to,
          err,
        });
      }
    }
  }
}

// Recursing through copy() instead would re-enter "dir -> dir" for a child
// whose target exists, nesting it one level deeper each time.
function copyDirTo(
  from: string,
  to: string,
  options: CopyOptions,
  trace: (...args: Array<any>) => void,
): void {
  trace("ensuring dir", to);
  const targetExisted = exists(to);
  mkdir(to, { recursive: true, logging: { info: noop } });
  if (!targetExisted) {
    const fromPerms =
      os.stat(from).mode & (os.S_IRWXU | os.S_IRWXG | os.S_IRWXO);
    os.chmod(to, fromPerms);
  }

  for (const child of ls(from)) {
    const childPath = child.toString();
    const target = new Path(to, basename(child)).toString();

    if (isLink(childPath)) {
      trace("recreating symlink", target);
      os.symlink(os.readlink(childPath), target);
    } else if (_getPathInfo(childPath) === "dir") {
      copyDirTo(childPath, target, options, trace);
    } else {
      copy(child, target, options);
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

  if (sourceInfo === "dir") {
    const fromReal = new Path(os.realpath(from));
    const toReal = new Path(
      exists(to)
        ? os.realpath(to)
        : os.realpath(new Path(to).dirname().toString()),
    );
    if (toReal.startsWith(fromReal)) {
      throw makeErrorWithProperties(
        "Cannot copy a directory into itself",
        { from, to },
      );
    }
  }

  trace("copy requested", { from, to });

  switch (`${sourceInfo} -> ${targetInfo}`) {
    case "dir -> file": {
      // Invalid
      throw new Error(
        `Attempting to copy folder to path where file already exists: ${to}`,
      );
    }
    case "file -> dir": {
      // Copy file into dir, going back through copy so that an existing
      // dir/<name> gets the same whenTargetExists handling as file -> file.
      const filename = basename(from);
      const target = new Path(to, filename).toString();
      copy(from, target, options);
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
      copyDirTo(from, to, options, trace);
      return;
    }
    case "dir -> dir": {
      // cp -R src dst makes dst/src
      const targetDir = new Path(to, basename(from)).toString();
      copyDirTo(from, targetDir, options, trace);
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
