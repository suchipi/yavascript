import type { ReactNode } from "react";
import type { Token } from "prism-react-renderer";
import type { Props } from "@theme/CodeBlock/Line/Token";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { usePluginData } from "@docusaurus/useGlobalData";
import {
  useApiDocLinks,
  type ApiDocLinks,
} from "@site/src/components/ApiCodeBlock";

import styles from "./styles.module.css";

type NameTable = Record<string, string>;

// What the api-doc-links plugin puts in global data: the site-wide maps, plus
// the members each page documents, split the way the headings name them
// (`Path.normalize` vs `Path.prototype.normalize`).
type SiteApiDocLinks = ApiDocLinks & {
  pages?: Record<string, { own?: NameTable; prototype?: NameTable }>;
};

function lookUp(table: NameTable | undefined, key: string): string | undefined {
  const href = table?.[key];
  // `constructor`, `toString` and friends would otherwise resolve to whatever
  // they inherit from Object.prototype.
  return typeof href === "string" ? href : undefined;
}

function previousMeaningfulIndex(line: Token[], index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    if (line[i].content.trim() !== "") return i;
  }
  return -1;
}

function isCode(token: Token): boolean {
  const { types } = token;
  // `builtin` and `keyword` cover the TypeScript names that are syntax rather
  // than API: `string`, `number`, `Array`, and the `is` of a type predicate.
  if (
    types.includes("comment") ||
    types.includes("regex") ||
    types.includes("keyword") ||
    types.includes("builtin")
  ) {
    return false;
  }
  // Prism tags both the literal text of a template string and the code inside
  // its `${...}` holes as `template-string`; only the text is also `string`.
  return !(types.includes("template-string") && types.includes("string"));
}

// `static` may sit behind other modifiers, as in `static readonly OS_...`.
function isStaticMember(line: Token[], index: number): boolean {
  for (
    let i = previousMeaningfulIndex(line, index);
    i !== -1;
    i = previousMeaningfulIndex(line, i)
  ) {
    if (line[i].content.trim() === "static") return true;
    if (!line[i].types.includes("keyword")) return false;
  }
  return false;
}

// A name a page documents is a member declaration; the same name between
// parentheses is a parameter that happens to match, so it gets no link.
function isBetweenParens(line: Token[], index: number): boolean {
  let depth = 0;
  for (let i = 0; i < index; i++) {
    for (const character of line[i].content) {
      if (character === "(") depth++;
      else if (character === ")") depth = Math.max(0, depth - 1);
    }
  }
  return depth > 0;
}

function resolveHref(
  line: Token[],
  token: Token,
  blockLinks: ApiDocLinks | null,
  pageLinks: { own?: NameTable; prototype?: NameTable } | undefined,
  siteLinks: SiteApiDocLinks | undefined,
): string | undefined {
  const name = token.content.trim();
  if (name === "" || !isCode(token)) return undefined;

  const index = line.indexOf(token);
  const dotIndex = previousMeaningfulIndex(line, index);
  if (dotIndex !== -1 && line[dotIndex].content.trim() === ".") {
    const receiverIndex = previousMeaningfulIndex(line, dotIndex);
    if (receiverIndex === -1) return undefined;
    const key = `${line[receiverIndex].content.trim()}.${name}`;
    return lookUp(blockLinks?.members, key) ?? lookUp(siteLinks?.members, key);
  }

  const fromBlock = lookUp(blockLinks?.identifiers, name);
  if (fromBlock) return fromBlock;

  if (pageLinks && !isBetweenParens(line, index)) {
    const fromPage = isStaticMember(line, index)
      ? lookUp(pageLinks.own, name)
      : (lookUp(pageLinks.prototype, name) ?? lookUp(pageLinks.own, name));
    if (fromPage) return fromPage;
  }

  return lookUp(siteLinks?.identifiers, name);
}

export default function CodeBlockLineToken({
  line,
  token,
  ...props
}: Props): ReactNode {
  const blockLinks = useApiDocLinks();
  const siteLinks = usePluginData("api-doc-links") as
    SiteApiDocLinks | undefined;
  const { pathname } = useLocation();

  const pageLinks = siteLinks?.pages?.[pathname.replace(/(.)\/$/, "$1")];
  const href = resolveHref(line, token, blockLinks, pageLinks, siteLinks);
  if (!href) {
    return <span {...props} />;
  }

  const name = token.content.trim();
  const nameStart = token.content.indexOf(name);
  return (
    <span {...props}>
      {token.content.slice(0, nameStart)}
      <Link className={styles.apiDocLink} to={href}>
        {name}
      </Link>
      {token.content.slice(nameStart + name.length)}
    </span>
  );
}
