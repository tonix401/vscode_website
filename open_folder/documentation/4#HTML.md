# HTML

HTML files (`.html`) are rendered inside a sandboxed `<iframe>` using the `srcDoc` attribute. A toggle button in the tab bar switches between the rendered preview and the syntax-highlighted source.

## CSS

`<link rel="stylesheet" href="...">` tags with a relative path are resolved at render time: if the path points to a file that exists inside the viewer, the file's content is inlined as a `<style>` block. This is necessary because the null-origin iframe cannot load relative URLs from the parent host.

External stylesheets (absolute URLs such as `https://cdn.example.com/styles.css`) are left as-is and load normally over the network.

If a relative `<link>` href does not match any file in the viewer, the tag is left unchanged and the stylesheet will not load.

## JavaScript

Scripts execute normally — the iframe uses `sandbox="allow-scripts"`.

## Navigation

Clicking a relative link inside the HTML file sends a message to the viewer, which opens the target file. The following are **not** intercepted:

- Same-page anchors (`#id`) — handled by the browser within the iframe
- Absolute URLs (`https://...`) — navigate the iframe itself
- Root-relative paths (`/path`) — navigate the iframe itself

## Limitations

The iframe runs with `sandbox="allow-scripts"` only. All other sandbox flags are absent, which means:

| Blocked capability | Reason |
|---|---|
| `localStorage` / `sessionStorage` / cookies | No `allow-same-origin` — iframe has a null origin |
| `alert()`, `confirm()`, `prompt()` | No `allow-modals` |
| Form submission | No `allow-forms` |
| `window.open()` / popups | No `allow-popups` |
| Navigating the parent page | No `allow-top-navigation` |

### Relative images and fonts do not load

`<img src="./logo.png">` and `url('./font.woff2')` in CSS will not resolve. Files inside the viewer are not served as static URLs. Use absolute URLs for any external assets.

### Relative `<link>` tags with no matching viewer file

If a `<link rel="stylesheet">` references a path that does not exist in the viewer, the tag is left as-is. Because the iframe has a null origin, the browser cannot resolve it and the stylesheet is silently skipped.
