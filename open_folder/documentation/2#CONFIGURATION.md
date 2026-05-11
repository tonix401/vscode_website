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
      folderPath:     "./open_folder",
      rootFolderName: "MY PROJECT",
      searchBarText:  "Search files by name (⌘P)",
      websiteTitle:   "My Project – Code Viewer",
      faviconPath:    "/favicon.svg",
    }),
  ],
});
```

## Options

### `folderPath`

| | |
|---|---|
| Type | `string` |
| Default | `"./src/open_folder"` |

Path (relative to the project root) to the directory whose contents are loaded into the viewer. All files and subdirectories inside are read at build time and embedded in the app.

---

### `rootFolderName`

| | |
|---|---|
| Type | `string` |
| Default | `"WEBSITE"` |

The label shown for the top-level folder in the Explorer sidebar. Displayed in all-caps by convention, matching the VSCode style.

---

### `searchBarText`

| | |
|---|---|
| Type | `string` |
| Default | `"Search files by name (⌘P)"` |

Placeholder text shown in the title-bar search field when no file is open. Once a file is selected, the search field shows the file name instead.

You can embed dynamic placeholders in the string. They are replaced either at build time or at runtime as described below.

#### Placeholders

| Placeholder | Replaced at | Value |
|---|---|---|
| `$root_folder_name` | build time | the `rootFolderName` option value |
| `$website_title` | build time | the `websiteTitle` option value |
| `$open_file` | runtime | the name of the currently open file |
| `$current_sub_folder` | runtime | the subfolder path of the currently open file (empty when the file is in the root) |

Build-time placeholders are substituted once when Vite compiles the app. Runtime placeholders are replaced reactively as the user navigates files.

**Example:**
```ts
searchBarText: "$root_folder_name — $open_file"
// shows "MY PROJECT — index.ts" when that file is open
```

Using an unrecognised `$word` token produces a build warning listing the known placeholders.

---

### `websiteTitle`

| | |
|---|---|
| Type | `string` |
| Default | `undefined` (uses whatever is in `index.html`) |

Sets the `<title>` tag in `index.html` at build/dev time. Appears in the browser tab and in search-engine results.

If omitted, the title already present in `index.html` is kept as-is.

---

### `faviconPath`

| | |
|---|---|
| Type | `string` |
| Default | `undefined` (uses whatever is in `index.html`) |

Replaces the `<link rel="icon">` tag in `index.html`. The value should be an absolute URL path (e.g. `"/favicon.svg"`) or any URL the browser can resolve.

Place custom favicon files in the `public/` directory so Vite copies them to the build output — files there are served at the root path without any hashing. For example, `public/favicon.png` is reachable as `"/favicon.png"`.

If omitted, the favicon already present in `index.html` is kept as-is.

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
