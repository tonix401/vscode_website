# Markdown

Markdown files (`.md`) are rendered as a formatted preview using [react-markdown](https://github.com/remarkjs/react-markdown) with the [remark-gfm](https://github.com/remarkjs/remark-gfm) plugin. A toggle button in the tab bar switches between the rendered preview and the syntax-highlighted source.

## Supported syntax

GitHub Flavored Markdown (GFM) is fully supported:

| Feature | Syntax |
|---|---|
| Headings | `# H1` through `###### H6` |
| Bold / italic | `**bold**`, `*italic*` |
| Strikethrough | `~~text~~` |
| Inline code | `` `code` `` |
| Fenced code blocks | ` ``` ` … ` ``` ` (with optional language hint) |
| Blockquotes | `> text` |
| Unordered lists | `- item` |
| Ordered lists | `1. item` |
| Task lists | `- [x] done`, `- [ ] todo` |
| Tables | GFM pipe syntax |
| Horizontal rules | `---` |
| Autolinks | bare URLs are linked automatically |

## Links

Relative links (e.g. `[Config](CONFIGURATION.md)`) navigate to that file inside the viewer. The following are **not** intercepted and behave as standard browser links:

- Same-page anchors (`#section`) — updates the URL fragment but does not scroll, because headings have no `id` attributes
- Absolute URLs (`https://...`) — open normally
- Root-relative paths (`/path`) — open normally

## Limitations

### Raw HTML is not rendered

Inline HTML tags (`<div>`, `<span style="...">`, etc.) are escaped and shown as plain text. The `rehype-raw` plugin is not included.

### Relative images do not load

`![alt](./image.png)` will render a broken image. Files inside the viewer are not served as static URLs — only images referenced by an absolute URL (`https://...`) will load.

### No emoji shortcodes

`:tada:` and similar shortcodes are not expanded. Use Unicode emoji directly.
