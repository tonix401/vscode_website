# Configuration

All configuration is passed to `openFolderPlugin()` in `vite.config.ts`.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { openFolderPlugin } from "./src/services/FilesConverterService";

export default defineConfig({
  plugins: [
    react(),
    openFolderPlugin({
      folderPath: "./open_folder",
      rootFolderName: "MY PROJECT",
      searchBarText: "Search files by name (⌘P)",
      websiteTitle: "My Project – Code Viewer",
      faviconPath: "/favicon.svg",
    }),
  ],
});
```

## Options

### `folderPath`

|         |                       |
| ------- | --------------------- |
| Type    | `string`              |
| Default | `"./src/open_folder"` |

Path (relative to the project root) to the directory whose contents are loaded into the viewer. All files and subdirectories inside are read at build time and embedded in the app.

---

### `rootFolderName`

|         |             |
| ------- | ----------- |
| Type    | `string`    |
| Default | `"WEBSITE"` |

The label shown for the top-level folder in the Explorer sidebar. Displayed in all-caps by convention, matching the VSCode style.

---

### `windowsDesktop`

Allows or bans the user from "closing" the vscode window and seeing a windows desktop

---

### `searchBarText`

|         |                               |
| ------- | ----------------------------- |
| Type    | `string`                      |
| Default | `"Search files by name (⌘P)"` |

Placeholder text shown in the title-bar search field when no file is open. Once a file is selected, the search field shows the file name instead.

You can embed dynamic placeholders in the string. They are replaced either at build time or at runtime as described below.

#### Placeholders

| Placeholder           | Replaced at | Value                                                                              |
| --------------------- | ----------- | ---------------------------------------------------------------------------------- |
| `$root_folder_name`   | build time  | the `rootFolderName` option value                                                  |
| `$website_title`      | build time  | the `websiteTitle` option value                                                    |
| `$open_file`          | runtime     | the name of the currently open file                                                |
| `$current_sub_folder` | runtime     | the subfolder path of the currently open file (empty when the file is in the root) |

Build-time placeholders are substituted once when Vite compiles the app. Runtime placeholders are replaced reactively as the user navigates files.

**Example:**

```ts
searchBarText: "$root_folder_name — $open_file";
// shows "MY PROJECT — index.ts" when that file is open
```

Using an unrecognised `$word` token produces a build warning listing the known placeholders.

---

### `websiteTitle`

|         |                                                |
| ------- | ---------------------------------------------- |
| Type    | `string`                                       |
| Default | `undefined` (uses whatever is in `index.html`) |

Sets the `<title>` tag in `index.html` at build/dev time. Appears in the browser tab and in search-engine results.

If omitted, the title already present in `index.html` is kept as-is.

---

### `faviconPath`

|         |                                                |
| ------- | ---------------------------------------------- |
| Type    | `string`                                       |
| Default | `undefined` (uses whatever is in `index.html`) |

Replaces the `<link rel="icon">` tag in `index.html`. The value should be an absolute URL path (e.g. `"/favicon.svg"`) or any URL the browser can resolve.

Place custom favicon files in the `public/` directory so Vite copies them to the build output — files there are served at the root path without any hashing. For example, `public/favicon.png` is reachable as `"/favicon.png"`.

If omitted, the favicon already present in `index.html` is kept as-is.

---

### `activities`

|         |                    |
| ------- | ------------------ |
| Type    | `CustomActivity[]` |
| Default | `[]`               |

Adds custom activity buttons under Explorer in the activity bar. Each entry adds a button; clicking it shows a panel in the sidebar.

The panel body renders Markdown (GFM). See [MARKDOWN.md](MARKDOWN.md) for supported syntax and limitations.

#### Activity fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes | Label used for the tooltip and accessibility text. |
| `iconPath` | `string` | yes | Codicon name (e.g. `"search"`) or an image path/URL such as `"/images/search.svg"`, `"https://..."`, or `"data:..."`. |
| `title` | `string` | yes | Heading shown at the top of the panel. |
| `text` | `string` | one of | Markdown string written directly in the config. |
| `textFile` | `string` | one of | Path (relative to the project root) to a `.md` file whose contents are used as the panel body. Read at build time, so changes during dev trigger a hot reload. |

Exactly one of `text` or `textFile` should be provided. If both are set, `textFile` takes precedence and a build warning is emitted.

For local icon files, place them in `public/` and reference them with a root-relative path (e.g. `"/images/my-icon.svg"`).

**Example — inline text:**

```ts
activities: [
  {
    name: "Search",
    iconPath: "search",
    title: "SEARCH",
    text: "Type to search across files.",
  },
],
```

**Example — text from file:**

```ts
activities: [
  {
    name: "Support",
    iconPath: "/images/support.svg",
    title: "SUPPORT",
    textFile: "./activities/support.md",
  },
],
```

---

## File ordering

By default, files and folders inside your `folderPath` are sorted alphabetically. You can override the order by adding a numeric prefix to any file or folder name:

```
open_folder/
  001#introduction.md
  002#getting-started.md
  003#advanced/
    001#config.md
    002#plugins.md
  004#reference.md
```

The prefix must be one or more digits followed by `#`. It is stripped before the name is displayed anywhere in the UI — the explorer, tab bar, breadcrumb, and browser title all show the clean name without the prefix.

Prefixes can be added to folders as well as files. Folders are still shown before files at each level (VSCode's default behaviour).

To control whether a folder starts expanded or collapsed, add `ex#` (expanded) or `co#` (collapsed) after the numeric prefix:

```
open_folder/
  001#co#advanced/
    001#config.md
  002#ex#api/
    001#reference.md
```

If you use both prefixes, the numeric prefix must come first. For example, `001#co#advanced/` is valid, but `co#001#advanced/` is invalid and will fail the build.

These prefixes are only read on folder names.
