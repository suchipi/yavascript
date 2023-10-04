import * as os from "quickjs:os";
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
  const builtins = new Set([
    "quickjs:std",
    "quickjs:os",
    "quickjs:bytecode",
    "quickjs:context",
  ]);

  const originalDefine = mod.define;
  mod.define = (name, obj) => {
    originalDefine(name, obj);
    builtins.add(name);
  };

  mod.resolve = (name, fromFile) => {
    if (builtins.has(name)) {
      return name;
    }

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

    const basedir = dirname(fromFile) || os.getcwd();
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

  const originalRead = mod.read;
  mod.read = (modulePath) => {
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
