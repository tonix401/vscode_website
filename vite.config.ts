import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { openFolderPlugin } from "./src/services/FilesConverterService";

export default defineConfig({
  plugins: [
    react(),
    openFolderPlugin({
      folderPath: "./src/open_folder",
    }),
  ],
});
