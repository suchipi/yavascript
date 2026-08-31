const fs = require("node:fs");
const path = require("node:path");

const inputPath = process.argv[2];
const outputPath = process.argv[3];

const isIndex = path.basename(inputPath) === "README.md";

// Relative .md links (rather than absolute urls) so docusaurus resolves them
// itself, which keeps them correct regardless of baseUrl/routeBasePath.
function rewriteLinks(content) {
  return content.replace(
    /(?<=\(|\s)\/meta\/generated-docs\/([\w.-]+)\.md/g,
    (_match, name) => `./${name === "README" ? "index" : name}.md`,
  );
}

// Docusaurus renders h1 without an id, since a page normally only has one and
// it's the title. These docs use h1 per API entry and link to them from their
// table of contents, so everything moves down a level to keep those anchors.
function demoteHeading(line) {
  return line.replace(/^(#{1,5}) /, "#$1 ");
}

// remark-directive reads `:name` as a text directive, so a heading like
// `"quickjs:std" (namespace)` slugs to "quickjs-namespace" unless the colon is
// escaped, which doesn't match the anchors dtsmd generated for it.
function escapeHeadingColons(line) {
  return line.replace(/:/g, "\\:");
}

function transformHeadings(content, { demote }) {
  let inFence = false;

  return content
    .split("\n")
    .map((line) => {
      if (/^\s*(?:```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence || !/^#{1,6} /.test(line)) return line;

      const escaped = escapeHeadingColons(line);
      return demote ? demoteHeading(escaped) : escaped;
    })
    .join("\n");
}

function stripGeneratedFileComment(content) {
  return content.replace(/^<!--[\s\S]*?-->\n/, "");
}

let content = fs.readFileSync(inputPath, "utf-8");

content = rewriteLinks(content);
content = transformHeadings(content, { demote: !isIndex });

// The title docusaurus would render is the file name, which just repeats the
// first heading on most of these pages; the sidebar and breadcrumb still show it.
const frontMatter = isIndex
  ? ["slug: /", "sidebar_label: API Documentation", "sidebar_position: 0"]
  : ["hide_title: true"];

content =
  ["---", ...frontMatter, "---", ""].join("\n") +
  (isIndex ? stripGeneratedFileComment(content) : content);

fs.writeFileSync(outputPath, content, "utf-8");
