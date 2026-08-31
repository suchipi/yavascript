import {createContext, useContext, type ReactNode} from 'react';
import CodeBlock from '@theme/CodeBlock';

export type ApiDocLinks = {
  identifiers?: Record<string, string>;
  // Keyed as `<receiver>.<member>` using the receiver text as it literally
  // appears in the snippet, because the highlighter has no type information to
  // tell `filePath.basename()` (a Path method) from the global `basename`.
  members?: Record<string, string>;
};

const ApiDocLinksContext = createContext<ApiDocLinks | null>(null);

export function useApiDocLinks(): ApiDocLinks | null {
  return useContext(ApiDocLinksContext);
}

export default function ApiCodeBlock({
  links,
  language,
  children,
}: {
  links: ApiDocLinks;
  language: string;
  children: string;
}): ReactNode {
  return (
    <ApiDocLinksContext.Provider value={links}>
      <CodeBlock language={language}>{children}</CodeBlock>
    </ApiDocLinksContext.Provider>
  );
}
