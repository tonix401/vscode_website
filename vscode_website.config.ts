import { type OpenFolderPluginOptions } from "./src/services/FilesConverterService";

export const configuration: OpenFolderPluginOptions = {
  folderPath: "./open_folder",
  rootFolderName: "WEBSITE",
  searchBarText: "Search files by name ($current_sub_folder)",
  websiteTitle: "VSCode Website Template",
  faviconPath: "/blue_dot.svg",
  activities: [
    {
      name: "Search", // The tooltip text for the activity button
      iconPath: "search", // The icon for the activity button (can be a codicon name or a file path)
      title: "SEARCH", // The title displayed in the panel header when this activity is active
      textFile: "./activities/search.md", // The text displayed below the title (markdown supported)
    },
    {
      name: "Source Control",
      iconPath: "source-control",
      title: "SOURCE CONTROL",
      textFile: "./activities/source-control.md",
    },
    {
      name: "Run and Debug",
      iconPath: "debug-alt",
      title: "RUN AND DEBUG",
      textFile: "./activities/run-and-debug.md",
    },
    {
      name: "Extensions",
      iconPath: "extensions",
      title: "EXTENSIONS",
      textFile: "./activities/extensions.md",
    },
  ],
};
