import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { openFolderPlugin } from "./src/services/FilesConverterService";

export default defineConfig({
  plugins: [
    react(),
    // TIP: Check the documentation to understand how to configure the plugin and what options it accepts
    openFolderPlugin({
      folderPath:     "./open_folder",
      rootFolderName: "WEBSITE",
      searchBarText:  "Search files by name ($current_sub_folder)",
      websiteTitle:   "VSCode Website Template",
      faviconPath:    "/blue_dot.svg",
    }),
  ],
});
