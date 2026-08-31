import type {ReactNode} from 'react';
import type {Token} from 'prism-react-renderer';
import type {Props} from '@theme/CodeBlock/Line/Token';
import Link from '@docusaurus/Link';
import {useApiDocLinks, type ApiDocLinks} from '@site/src/components/ApiCodeBlock';

import styles from './styles.module.css';

function previousMeaningfulIndex(line: Token[], index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    if (line[i].content.trim() !== '') return i;
  }
  return -1;
}

function isCode(token: Token): boolean {
  const {types} = token;
  if (types.includes('comment') || types.includes('regex')) return false;
  // Prism tags both the literal text of a template string and the code inside
  // its `${...}` holes as `template-string`; only the text is also `string`.
  return !(types.includes('template-string') && types.includes('string'));
}

function resolveHref(
  line: Token[],
  token: Token,
  links: ApiDocLinks,
): string | undefined {
  const name = token.content.trim();
  if (name === '' || !isCode(token)) return undefined;

  const dotIndex = previousMeaningfulIndex(line, line.indexOf(token));
  if (dotIndex === -1 || line[dotIndex].content.trim() !== '.') {
    return links.identifiers?.[name];
  }

  const receiverIndex = previousMeaningfulIndex(line, dotIndex);
  if (receiverIndex === -1) return undefined;
  return links.members?.[`${line[receiverIndex].content.trim()}.${name}`];
}

export default function CodeBlockLineToken({
  line,
  token,
  ...props
}: Props): ReactNode {
  const links = useApiDocLinks();
  const href = links && resolveHref(line, token, links);
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
