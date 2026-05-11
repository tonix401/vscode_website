# Markdown Preview

This is a **bold** statement and this is *italic*. You can also combine **_both_**.

## Navigation

Links to other files in the viewer work just like normal markdown links — click
them and the app navigates without leaving the page.

- [Main documentation page](./CONFIGURATION.md)
- [Some interesting examples](../examples/markdown.md)

## Code

Inline `code` looks like this, and a fenced block:

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

## Blockquote

> This is a blockquote. It renders with a blue left border to match the VSCode accent color.

## Table

| Name    | Type   | Default |
|---------|--------|---------|
| file    | string | —       |
| lang    | string | `text`  |
| theme   | string | `dark-plus` |

## Task List

- [x] Install react-markdown
- [x] Add remark-gfm for GFM support
- [x] In-app link navigation
- [ ] The one piece
