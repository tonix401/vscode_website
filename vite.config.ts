import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { openFolderPlugin } from "./src/services/FilesConverterService";
import { configuration } from "./vscode_website.config";

export default defineConfig({
  plugins: [
    react(),
    openFolderPlugin(configuration),
  ],
});
