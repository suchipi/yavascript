import * as std from "std";
import * as os from "os";
import { Path } from "./path";
import { dirname } from "./commands/dirname";
import { readFile } from "./filesystem";
import { makeErrorWithProperties } from "../error-with-properties";
import compilers from "../compilers";

function isFile(path: string) {
  try {
    const stats = os.stat(path);
    return (stats.mode & os.S_IFMT) == os.S_IFREG;
  } catch (err) {
    return false;
  }
}

function nodeModulePaths(dir: string) {
  const parts = Path.splitToSegments(dir);

  const dirs: Array<string> = [];
  parts.forEach((part, index, all) => {
    const dir = Path.join(...parts.slice(0, index + 1), "node_modules");
    dirs.push(dir);
  });

  return dirs.reverse();
}

function potentialFilesForPath(path: string) {
  const potentials = [
    path,
    ...Module.searchExtensions.map((ext) => path + ext),
    ...Module.searchExtensions.map((ext) => path + "/index" + ext),
  ];

  try {
    const pkgJsonPath = path + "/package.json";
    if (isFile(pkgJsonPath)) {
      const pkgStr = readFile(pkgJsonPath);
      const pkg = JSON.parse(pkgStr);
      if (typeof pkg.main === "string") {
        const pkgMainFile = Path.resolve(path, pkg.main);
        return [pkgMainFile];
      }
    }
  } catch (err) {
    // ignored
  }

  return potentials;
}

export function installModuleHooks(mod: typeof Module) {
  const builtins = new Set(["os", "path"]);

  const originalDefine = mod.define;
  mod.define = (name, obj) => {
    originalDefine(name, obj);
    builtins.add(name);
  };

  const HTTP_RE = /^https?:\/\//i;

  mod.resolve = (name, fromFile) => {
    if (builtins.has(name)) {
      return name;
    }

    if (HTTP_RE.test(name)) {
      return name;
    }

    if (Path.isAbsolute(name)) {
      return name;
    }

    const basedir = dirname(fromFile) || os.getcwd();
    const parts = Path.splitToSegments(name);
    if (parts[0] === "." || parts[0] === "..") {
      const paths = potentialFilesForPath(Path.join(basedir, ...parts));
      for (const path of paths) {
        if (isFile(path)) {
          return os.realpath(path);
        }
      }
    } else {
      // find node module
      for (const nmPath of nodeModulePaths(basedir)) {
        const paths = potentialFilesForPath(Path.join(nmPath, name));
        for (const path of paths) {
          if (isFile(path)) {
            return os.realpath(path);
          }
        }
      }
    }

    throw makeErrorWithProperties(
      `Couldn't resolve module '${name}' from '${fromFile}'`,
      {
        name,
        fromFile,
      }
    );
  };

  const originalRead = mod.read;
  mod.read = (modulePath) => {
    if (HTTP_RE.test(modulePath)) {
      const content = std.urlGet(modulePath);
      return compilers.autodetect(content, { filename: modulePath });
    } else {
      return originalRead(modulePath);
    }
  };
}
