import * as std from "std";
import * as os from "os";
import * as util from "node-inspect-extracted";
import kleur from "kleur";

// @ts-ignore assignment to value incorrectly typed as read-only
kleur.enabled = true;

const env = new Proxy(
  {},
  {
    get(target, property, receiver) {
      if (typeof property === "symbol") return undefined;
      return std.getenv(property) || undefined;
    },

    set(target, property, value, receiver) {
      if (typeof property === "symbol") return false;

      if (value == null) {
        std.unsetenv(property);
      } else {
        std.setenv(property, value);
      }

      return true;
    },

    deleteProperty(target, property) {
      if (typeof property === "symbol") return false;

      std.unsetenv(property);
      return true;
    },
  }
);

function exec(args: Array<string>): number {
  const status = os.exec(args, {
    stdin: std.in.fileno(),
    stdout: std.out.fileno(),
    stderr: std.err.fileno(),
  });
  return status;
}

function $(args: Array<string>): {
  stdout: string;
  stderr: string;
  status: number;
} {
  const tmpOut = std.tmpfile();
  const tmpErr = std.tmpfile();
  try {
    const status = os.exec(args, {
      stdout: tmpOut.fileno(),
      stderr: tmpErr.fileno(),
    });

    const stdout = tmpOut.readAsString();
    const stderr = tmpErr.readAsString();

    return { stdout, stderr, status };
  } finally {
    tmpErr.close();
    tmpOut.close();
  }
}

function readFile(path: string): string {
  return std.loadFile(path)!;
}

function writeFile(path: string, data: string | ArrayBuffer): void {
  const file = std.open(path, "w");
  try {
    if (typeof data === "string") {
      file.puts(data);
    } else {
      file.write(data, 0, data.byteLength);
    }
  } finally {
    file.close();
  }
}

function remove(path: string): void {
  const stats = os.lstat(path);
  if (os.S_IFDIR & stats.mode) {
    const children = os
      .readdir(path)
      .filter((child) => child !== "." && child !== "..")
      .map((child) => path + "/" + child);

    for (const child of children) {
      remove(child);
    }
  }

  os.remove(path);
}

function exists(path: string): boolean {
  try {
    os.access(path, os.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function cd(path: string): void {
  os.chdir(path);
}

function pwd(): string {
  return os.getcwd();
}

function glob(...inputs: Array<string>): Array<string> {
  throw new Error("not yet implemented");
}

const baseApi = {
  echo: console.log,
  cd,
  pwd,

  env,
  exec,
  $,

  readFile,
  writeFile,
  exists,
  remove,
  glob,

  inspect: util.inspect,
  stripAnsi: util.stripVTControlCharacters,
  quote: JSON.stringify.bind(JSON),
};

const api = Object.assign(baseApi, kleur as Omit<typeof kleur, "enabled">);

// @ts-ignore deleting property that doesn't exist on type (due to Omit cast)
delete api.enabled;

export default api;
