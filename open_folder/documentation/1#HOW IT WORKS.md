# How it works

A custom Vite plugin reads everything in `src/open_folder/` at build time and bundles it into a virtual module (`virtual:open-folder-files`). The React app consumes that module — no runtime file I/O, no server. The output is a fully static site.

Subdirectories are supported and show up as collapsible folders in the sidebar, just like the real thing.

All the files inside `open_folder/` are your content — adjust them to whatever you want them to say. The rest of the project is the VSCode template and does not need to be touched.

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

HTML and Markdown files also support in-app link navigation and relative CSS inlining

|                            |                                    |                                   |
| -------------------------- | ---------------------------------- | --------------------------------- |
| [Html formatting](HTML.md) | [Markdown formatting](MARKDOWN.md) | [Configuration](CONFIGURATION.md) |

## Supported file types

TypeScript, TSX, JavaScript, JSX, HTML, CSS, JSON, Markdown, Python, Rust, Go, Java, C/C++, PHP, Ruby, SQL, YAML, TOML, XML, Vue, Svelte, and shell scripts.
