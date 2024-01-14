import * as os from "quickjs:os";
import { ModuleDelegate } from "quickjs:engine";
import { Path } from "./api/path";
import { dirname } from "./api/commands/dirname";
import { readFile, isFile } from "./api/filesystem";
import { makeErrorWithProperties } from "./error-with-properties";
import * as protos from "./module-protocols/_all";

function nodeModulePaths(dir: string) {
  const parts = Path.splitToSegments(dir);

  const dirs: Array<string> = [];
  parts.forEach((part, index, all) => {
    const dir = Path.join(
      ...parts.slice(0, index + 1),
      "node_modules"
    ).toString();

    dirs.push(dir);
  });

  return dirs.reverse();
}

function potentialFilesForPath(path: string): Array<string> {
  const potentials = [
    path,
    ...ModuleDelegate.searchExtensions.map((ext) => path + ext),
    ...ModuleDelegate.searchExtensions.map((ext) => path + "/index" + ext),
  ];

  try {
    const pkgJsonPath = path + "/package.json";
    if (isFile(pkgJsonPath)) {
      const pkgStr = readFile(pkgJsonPath);
      const pkg = JSON.parse(pkgStr);
      if (typeof pkg.main === "string") {
        const pkgMainFile = Path.normalize(path, pkg.main);
        if (pkgMainFile.isAbsolute() && isFile(pkgMainFile)) {
          return [pkgMainFile.toString()];
        }
      }
    }
  } catch (err) {
    // ignored
  }

  return potentials;
}

export function installModuleHooks() {
  ModuleDelegate.resolve = (name, fromFile) => {
    if (name.startsWith("quickjs:")) {
      return name;
    }

    // TODO: quickjs needs to expose the list of user-defined builtin modules so
    // that we can return them as-is

    // need to check npm first, because http(s) URLs that point to the CDN that
    // the npm: proto is backed by (skypack) should be handled by its handler
    // code, not the generic http(s) handler code
    if (protos.npm.handlesModulePath(name)) {
      return protos.npm.normalizeModulePath(name);
    }

    if (protos.https.handlesModulePath(name)) {
      return protos.https.normalizeModulePath(name);
    }

    if (protos.http.handlesModulePath(name)) {
      return protos.http.normalizeModulePath(name);
    }

    if (Path.isAbsolute(name)) {
      return name;
    }

    const basedir = dirname(fromFile).toString() || os.getcwd();
    const parts = Path.splitToSegments(name);
    if (parts[0] === "." || parts[0] === "..") {
      const paths = potentialFilesForPath(
        Path.join(basedir, ...parts).toString()
      );
      for (const path of paths) {
        if (isFile(path)) {
          return os.realpath(path.toString());
        }
      }
    } else {
      // find node module
      for (const nmPath of nodeModulePaths(basedir)) {
        const paths = potentialFilesForPath(Path.join(nmPath, name).toString());
        for (const path of paths) {
          if (isFile(path)) {
            return os.realpath(path.toString());
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

  const originalRead = ModuleDelegate.read;
  ModuleDelegate.read = (modulePath) => {
    if (protos.npm.handlesModulePath(modulePath)) {
      return protos.npm.readModule(modulePath);
    }

    if (protos.https.handlesModulePath(modulePath)) {
      return protos.https.readModule(modulePath);
    }

    if (protos.http.handlesModulePath(modulePath)) {
      return protos.http.readModule(modulePath);
    }

    return originalRead(modulePath);
  };
}
