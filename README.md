![screenshot of the finished page](.docs/screenshot.png)

# vscode_website

A browser-based file viewer that looks and like VSCode. Drop files into `src/open_folder/`, run the dev server, and you get a read-only VSCode-style interface — sidebar tree, tab bar, line numbers, syntax highlighting via Shiki, the whole thing.

The idea is to embed it in a portfolio or project page so visitors can browse source files without leaving the browser.

## How it works

A custom Vite plugin reads everything in `src/open_folder/` at build time and bundles it into a virtual module (`virtual:open-folder-files`). The React app consumes that module — no runtime file I/O, no server. The output is a fully static site.

Subdirectories are supported and show up as collapsible folders in the sidebar, just like the real thing.

So, all the files in the src/open_folder are just decoration and need to be adjusted to whatever you want them to say, the rest of the project is the vscode template

```
open_folder/
├─ index.html
├─ script.js
├─ styles.css
├─ first topic/
│  ├─ index.html
│  ├─ script.js
│  ├─ styles.css
│  └─ test.md
└─ second topic/
   ├─ index.html
   ├─ script.js
   └─ styles.css
```

## In-app link navigation

HTML and Markdown files can link to other files in the viewer using standard relative paths. Clicking those links navigates within the app — the sidebar selection updates, the tab bar changes, and no browser navigation happens.

```html
<!-- from first topic/index.html -->
<a href="./test.md">Read the docs</a>
<a href="../second topic/index.html">Second Topic</a>
```

```md
<!-- from first topic/test.md -->
[First Topic HTML page](./index.html)
[Second Topic](../second%20topic/index.html)
```

Rules for links that trigger in-app navigation:

- Must be a **relative path** (no scheme, no leading `/`)
- Same-page anchors (`#section`) are left alone
- External URLs (`https://…`) open normally in Markdown; are ignored in HTML previews

## CSS in HTML previews

HTML files rendered in the iframe can reference external stylesheets with a normal `<link>` tag. The viewer resolves the path at render time and inlines the file as a `<style>` block, since sandboxed `srcDoc` iframes can't load relative URLs from disk.

```html
<link rel="stylesheet" href="./styles.css" />
<link rel="stylesheet" href="../shared/base.css" />
```

The same relative-path rules apply: only paths within `src/open_folder/` resolve; external URLs are left as-is (and silently fail to load inside the sandbox, which is expected).

## Getting started

```bash
npm run build    # type-check + production build
npm run preview  # serve the build locally
```

## Supported file types

TypeScript, TSX, JavaScript, JSX, HTML, CSS, JSON, Markdown, Python, Rust, Go, Java, C/C++, PHP, Ruby, SQL, YAML, TOML, XML, Vue, Svelte, and shell scripts.

## Stack

- React 19
- Vite 8
- Shiki (syntax highlighting)
- TypeScript


### a little test

[Docs](.docs/DOCUMENTATION.md)