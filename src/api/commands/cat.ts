import * as std from "std";

export function cat(...paths: Array<string>): string {
  let content = "";
  for (const path of paths) {
    const newContent = std.loadFile(path);
    content += newContent;
    std.out.puts(newContent);
  }
  return content;
}
