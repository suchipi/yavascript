// These don't need to be perfect, just enough to make it more convenient
// to do certain things in the repl or eval
const str = /'[^']*'|"[^"]*"/.source;
const optWs = /\s*/.source;
const ident = /[A-Za-z$_][A-Za-z0-9$_]*/.source;

const bareImport = `import${optWs}(${str})`;
const defaultImport = `import${optWs}(${ident})\\s+from${optWs}(${str})`;
const nsImport = `import${optWs}\\*${optWs}as\\s+(${ident})${optWs}from${optWs}(${str})`;

const aliasedNamedSpecifier = `${ident}\\s+as\\s+${ident}`;
const namedSpecifier = `${aliasedNamedSpecifier}|${ident}`;
const namedSpecifierList = `((?:${namedSpecifier}${optWs},?${optWs})+)`;

const namedImport = `import${optWs}\\{${optWs}${namedSpecifierList}${optWs}\\}${optWs}from${optWs}(${str})`;

// only translate bare statements, so we don't munge stuff inside string literals
const stmt = (content: string) => `^${optWs}${content}[;\s]*\$`;

const bareImportStmt = new RegExp(stmt(bareImport), "m");
const defaultImportStmt = new RegExp(stmt(defaultImport), "m");
const nsImportStmt = new RegExp(stmt(nsImport), "m");
const namedImportStmt = new RegExp(stmt(namedImport), "m");

// require() already unwraps CommonJS, JSON, YAML and TOML modules to their
// exported value, which has no "default" to read.
const defaultOf = (source: string) =>
  `((m) => (m != null && typeof m === "object" && "default" in m ? m.default : m))(require(${source}))`;

const wsAsWs = /\sas\s/;

// Ordered so the more specific forms are tried before the permissive one.
const anyImportStmt = new RegExp(
  stmt(`(?:${nsImport}|${namedImport}|${defaultImport}|${bareImport})`),
  "gm",
);

function transformStatement(line: string): string {
  let matches: RegExpMatchArray | null = null;
  if ((matches = line.match(bareImportStmt))) {
    return `require(${matches[1]})`;
  } else if ((matches = line.match(defaultImportStmt))) {
    return `${matches[1]} = ${defaultOf(matches[2])}`;
  } else if ((matches = line.match(nsImportStmt))) {
    return `${matches[1]} = require(${matches[2]})`;
  } else if ((matches = line.match(namedImportStmt))) {
    const allSpecifiers = matches[1];
    const source = matches[2];

    const specifiers = allSpecifiers
      .split(/\s*,\s*/g)
      .map((specifier) => specifier.trim())
      .filter(Boolean);

    const properties: Array<string> = [];
    const bindings: Array<string> = [];

    for (const specifier of specifiers) {
      if (wsAsWs.test(specifier)) {
        const [exportedName, importedName = exportedName] =
          specifier.split(wsAsWs);
        if (exportedName != null && importedName != null) {
          properties.push(`${exportedName}: ${importedName}`);
          bindings.push(importedName);
        } else {
          // idk what's going on but it's not what I expect.
          // give up on transforming this
          return line;
        }
      } else {
        properties.push(specifier);
        bindings.push(specifier);
      }
    }

    return (
      `({ ${properties.join(", ")} } = require(${source})); ` +
      (bindings.length === 1 ? bindings[0] : `({ ${bindings.join(", ")} })`)
    );
  } else {
    return line;
  }
}

export function transform(input: string): string {
  return input.replace(anyImportStmt, (...args) => {
    const match = args[0] as string;
    const offset = args[args.length - 2] as number;
    const transformed = transformStatement(match);

    const needsSeparator =
      /\S/.test(input.slice(0, offset)) && transformed.trimStart().startsWith("(");

    return needsSeparator ? ";" + transformed : transformed;
  });
}
