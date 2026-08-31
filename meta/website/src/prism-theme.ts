import type {PrismTheme} from 'prism-react-renderer';

// The official Dracula palette, and its official light counterpart Alucard:
// https://github.com/dracula/dracula-theme#color-palette-oss
const dark = {
  background: '#282a36',
  foreground: '#f8f8f2',
  comment: '#6272a4',
  string: '#f1fa8c',
  constant: '#bd93f9',
  keyword: '#ff79c6',
  type: '#8be9fd',
  entity: '#50fa7b',
  parameter: '#ffb86c',
};

const light = {
  background: '#fffbeb',
  foreground: '#1f1f1f',
  comment: '#6c664b',
  string: '#846e15',
  constant: '#644ac9',
  keyword: '#a3144d',
  type: '#036a96',
  entity: '#14710a',
  parameter: '#a34d14',
};

function makeTheme(colors: typeof dark): PrismTheme {
  return {
    plain: {
      color: colors.foreground,
      backgroundColor: colors.background,
    },
    styles: [
      {
        types: ['comment', 'prolog', 'cdata', 'doctype'],
        style: {color: colors.comment},
      },
      {
        types: ['punctuation', 'variable', 'entity', 'url', 'property'],
        style: {color: colors.foreground},
      },
      {
        types: ['keyword', 'operator', 'tag', 'atrule', 'important'],
        style: {color: colors.keyword},
      },
      {
        types: ['builtin', 'symbol'],
        style: {color: colors.type, fontStyle: 'italic'},
      },
      {
        types: ['class-name', 'function', 'attr-name', 'selector'],
        style: {color: colors.entity},
      },
      {
        types: ['string', 'char', 'attr-value', 'inserted'],
        style: {color: colors.string},
      },
      {
        types: ['number', 'boolean', 'constant', 'deleted'],
        style: {color: colors.constant},
      },
      {
        types: ['regex', 'parameter'],
        style: {color: colors.parameter, fontStyle: 'italic'},
      },
    ],
  };
}

export const prismThemeLight = makeTheme(light);
export const prismThemeDark = makeTheme(dark);
