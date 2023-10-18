import { setHelpText } from "../help";
import createElementHelp from "./jsx_createElement.help.md";
import ElementHelp from "./jsx_Element.help.md";
import FragmentHelp from "./jsx_Fragment.help.md";
import pragmaHelp from "./jsx_pragma.help.md";
import pragmaFragHelp from "./jsx_pragmaFrag.help.md";
import JSXHelp from "./jsx.help.md";

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

setHelpText(JSX.pragma, pragmaHelp);
setHelpText(JSX.pragmaFrag, pragmaFragHelp);
setHelpText(JSX.Fragment, FragmentHelp);
setHelpText(JSX.Element, ElementHelp);
setHelpText(JSX.createElement, createElementHelp);
setHelpText(JSX, JSXHelp);
