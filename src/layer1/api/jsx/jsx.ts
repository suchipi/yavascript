const Fragment = Symbol("JSX.Fragment");
const Element = Symbol("JSX.Element");

export const JSX = {
  pragma: "JSX.createElement",
  pragmaFrag: "JSX.Fragment",

  Fragment,
  Element,

  createElement(type: any, props: any, ...children: any) {
    if (children.length > 0) {
      props = props ?? {};
      props.children = children;
    }

    let key = null;
    if (props != null) {
      key = props.key ?? null;
    }

    return { $$typeof: Element, type, props, key };
  },
};

export namespace JSX {
  export interface Element<
    Props = { [key: string | symbol | number]: any },
    Type = any,
  > {
    $$typeof: typeof Element;
    type: Type;
    props: Props;
    key: string | number | null;
  }

  export type Fragment = Element<{}, typeof Fragment>;
}
