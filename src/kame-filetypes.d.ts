declare module "*.md" {
  const content: string;
  export = content;
}

declare module "*.txt" {
  const content: string;
  export = content;
}

declare module "*?contentString" {
  const content: string;
  export = content;
}

declare module "*?evalAtBuildTime" {
  const result: any;
  export = result;
}
