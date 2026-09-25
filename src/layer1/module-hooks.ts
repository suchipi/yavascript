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
    const dir = new Path(
      ...parts.slice(0, index + 1),
      "node_modules",
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

// There's no URL global, so this does the part of URL resolution that module
// specifiers need: "/x" against the origin, "./x" and "../x" against the
// directory the importing module sits in.
function resolveAgainstUrl(base: string, specifier: string): string | null {
  if (!specifier.startsWith("/") && !specifier.startsWith(".")) return null;

  const schemeEnd = base.indexOf("://");
  if (schemeEnd === -1) return null;

  const pathStart = base.indexOf("/", schemeEnd + 3);
  const origin = pathStart === -1 ? base : base.slice(0, pathStart);

  if (specifier.startsWith("/")) return origin + specifier;

  const basePath = (pathStart === -1 ? "/" : base.slice(pathStart)).split(
    /[?#]/,
  )[0];
  const baseDir = basePath.slice(0, basePath.lastIndexOf("/") + 1);

  const segments: Array<string> = [];
  for (const segment of (baseDir + specifier).split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }

  return origin + "/" + segments.join("/");
}

export function installModuleHooks() {
  ModuleDelegate.resolve = (name, fromFile) => {
    if (ModuleDelegate.builtinModuleNames.includes(name)) {
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

    // A module loaded over http(s) has a URL for its fromFile, so its own
    // imports have to be resolved against that URL rather than the local disk.
    if (fromFile != null && /^https?:\/\//i.test(fromFile)) {
      const resolved = resolveAgainstUrl(fromFile, name);
      if (resolved != null) return resolved;
    }

    if (Path.isAbsolute(name)) {
      return name;
    }

    const basedir = dirname(fromFile).toString() || os.getcwd();
    const parts = Path.splitToSegments(name);
    if (parts[0] === "." || parts[0] === "..") {
      const paths = potentialFilesForPath(
        new Path(basedir, ...parts).toString(),
      );
      for (const path of paths) {
        if (isFile(path)) {
          return os.realpath(path.toString());
        }
      }
    } else {
      // find node module
      for (const nmPath of nodeModulePaths(basedir)) {
        const paths = potentialFilesForPath(new Path(nmPath, name).toString());
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
        moduleName: name,
        fromFile,
      },
    );
  };

  const originalRead = ModuleDelegate.read;
  ModuleDelegate.read = (modulePath, attributes) => {
    if (protos.npm.handlesModulePath(modulePath)) {
      return protos.npm.readModule(modulePath);
    }

    if (protos.https.handlesModulePath(modulePath)) {
      return protos.https.readModule(modulePath, attributes);
    }

    if (protos.http.handlesModulePath(modulePath)) {
      return protos.http.readModule(modulePath, attributes);
    }

    return originalRead(modulePath, attributes);
  };
}
