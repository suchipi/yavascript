/**
 * Opens the resource at the given path or URL using the operating system's
 * default application or handler.
 *
 * Examples:
 *
 * ```ts
 * openUrl("/home/me/stuff/code.txt"); // opens code.txt in your default text editor
 * openUrl("code.txt"); // same as above, using relative path
 * openUrl("file:///home/me/stuff/code.txt"); // same as above, using file:// url
 *
 * openUrl("IMG_001.jpg"); // opens IMG_001.jpg in your default image viewer
 *
 * openUrl("https://example.com/") // opens example.com in your default web browser
 * ```
 */
declare function openUrl(urlOrFilePath: string | Path): void;
