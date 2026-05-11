/// <reference types="vite/client" />

declare module "virtual:open-folder-files" {
  import { type TreeNode } from "./services/types";
  const tree: TreeNode[];
  export default tree;
}

declare module "virtual:open-folder-langs" {
  import type { LanguageInput } from "@shikijs/types";
  const langs: LanguageInput[];
  export default langs;
}

declare module "virtual:open-folder-config" {
  export const searchBarText: string;
  export const rootFolderName: string;
}
