const fs = require("node:fs");
const path = require("node:path");
const { createSlugger } = require("@docusaurus/utils");

// These headings document YavaScript's additions to standard TypeScript and
// ECMAScript declarations, so linking every mention of the name would point at
// an augmentation rather than at the thing being written.
const UNLINKABLE_NAMES = new Set([
  "string",
  "number",
  "boolean",
  "bigint",
  "symbol",
  "String",
  "Array",
]);

// When one name has several headings, the one describing its shape wins;
// `(constructor)` headings are the least informative, so they lose to anything.
const KIND_RANK = [
  "class",
  "interface",
  "namespace",
  "object",
  "type",
  "function",
  "value",
];

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const MODULE_SPECIFIER = /^"[^"]+"$/;
const MEMBER = /^([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)$/;
const MODULE_MEMBER = /^"quickjs:(\w+)"\.([A-Za-z_$][\w$]*)$/;
const MEMBER_TAIL = /\.([A-Za-z_$][\w$]*)$/;
const PROTOTYPE_MEMBER = /\.prototype\.[A-Za-z_$][\w$]*$/;

function rankOf(kind) {
  const rank = KIND_RANK.indexOf(kind);
  if (rank !== -1) return rank;
  return kind === "constructor" ? KIND_RANK.length + 1 : KIND_RANK.length;
}

function readHeadings(filePath, permalink) {
  const slugger = createSlugger();
  const headings = [];
  let inFence = false;

  for (const line of fs.readFileSync(filePath, "utf-8").split("\n")) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !/^#{1,6} /.test(line)) continue;

    const text = line
      .replace(/^#{1,6} /, "")
      .replace(/\\(.)/g, "$1")
      .replace(/`/g, "")
      .trim();
    // Every heading has to go through the slugger, matching heading for
    // heading, or its de-duplication suffixes drift from Docusaurus's.
    const href = `${permalink}#${slugger.slug(text)}`;

    const parsed = /^(.+) \(([^()]*)\)$/.exec(text);
    if (parsed) {
      headings.push({ name: parsed[1], kind: parsed[2], href, permalink });
    }
  }

  return headings;
}

function addCandidate(map, key, heading) {
  const candidates = map.get(key);
  if (candidates) candidates.push(heading);
  else map.set(key, [heading]);
}

function resolveCandidates(map) {
  const resolved = {};
  for (const [key, candidates] of map) {
    const bestRank = Math.min(...candidates.map((c) => rankOf(c.kind)));
    const tied = candidates.filter((c) => rankOf(c.kind) === bestRank);
    if (tied.every((c) => c.href === tied[0].href))
      resolved[key] = tied[0].href;
  }
  return resolved;
}

// A value documented as `foo (Bar)` has the members of `Bar`, so `Bar.baz`
// also answers for `foo.baz` (this is how `console.log` gets a link).
function aliasedReceivers(headings) {
  const shapes = new Set(
    headings
      .filter((h) => h.kind === "interface" || h.kind === "class")
      .map((h) => h.name),
  );
  const aliases = new Map();
  for (const heading of headings) {
    if (!IDENTIFIER.test(heading.name)) continue;
    if (heading.name === heading.kind || !shapes.has(heading.kind)) continue;
    const existing = aliases.get(heading.kind);
    if (existing) existing.push(heading.name);
    else aliases.set(heading.kind, [heading.name]);
  }
  return aliases;
}

function buildLinks(headings) {
  const identifiers = new Map();
  const members = new Map();

  for (const heading of headings) {
    const { name } = heading;
    if (IDENTIFIER.test(name)) {
      if (!UNLINKABLE_NAMES.has(name)) addCandidate(identifiers, name, heading);
    } else if (MODULE_SPECIFIER.test(name)) {
      addCandidate(identifiers, name, heading);
    } else if (MEMBER.test(name)) {
      addCandidate(members, name, heading);
    } else {
      const moduleMember = MODULE_MEMBER.exec(name);
      if (moduleMember) {
        addCandidate(members, `${moduleMember[1]}.${moduleMember[2]}`, heading);
      }
    }
  }

  const aliases = aliasedReceivers(headings);
  for (const [key, candidates] of [...members]) {
    const [receiver, member] = key.split(".");
    for (const alias of aliases.get(receiver) ?? []) {
      for (const candidate of candidates) {
        addCandidate(members, `${alias}.${member}`, candidate);
      }
    }
  }

  return {
    identifiers: resolveCandidates(identifiers),
    members: resolveCandidates(members),
    pages: buildPageMembers(headings),
  };
}

// The members a page documents, so that a bare name in one of its code blocks
// resolves to the thing that page is about: `remove` on the "quickjs:os" page
// is `os.remove`, not the global `remove`. `Path.normalize` and
// `Path.prototype.normalize` are both written `normalize` in the class body,
// so they stay in separate tables and the `static` modifier picks between them.
function buildPageMembers(headings) {
  const perPage = new Map();

  for (const heading of headings) {
    const tail = MEMBER_TAIL.exec(heading.name);
    if (!tail || UNLINKABLE_NAMES.has(tail[1])) continue;
    const page = pageKey(heading.permalink);
    let tables = perPage.get(page);
    if (!tables)
      perPage.set(page, (tables = { own: new Map(), prototype: new Map() }));
    const table = PROTOTYPE_MEMBER.test(heading.name)
      ? tables.prototype
      : tables.own;
    addCandidate(table, tail[1], heading);
  }

  const pages = {};
  for (const [page, tables] of perPage) {
    pages[page] = {
      own: resolveCandidates(tables.own),
      prototype: resolveCandidates(tables.prototype),
    };
  }
  return pages;
}

function pageKey(permalink) {
  return permalink.replace(/(.)\/$/, "$1");
}

module.exports = function apiDocLinksPlugin({ siteDir }) {
  return {
    name: "api-doc-links",

    async allContentLoaded({ allContent, actions }) {
      const versions =
        allContent["docusaurus-plugin-content-docs"]?.default?.loadedVersions;
      if (!versions) {
        throw new Error("api-doc-links: no docs content to read headings from");
      }

      const headings = [];
      for (const version of versions) {
        for (const doc of version.docs) {
          const filePath = path.join(
            siteDir,
            doc.source.replace(/^@site\//, ""),
          );
          headings.push(...readHeadings(filePath, doc.permalink));
        }
      }

      actions.setGlobalData(buildLinks(headings));
    },
  };
};
