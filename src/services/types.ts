export type FileType =
  | "html" | "css" | "js" | "ts" | "tsx" | "jsx"
  | "md" | "py" | "json" | "yaml" | "rs" | "go" | "sh"
  | "php" | "rb" | "c" | "cpp" | "java"
  | "sql" | "xml" | "toml" | "vue" | "svelte"
  | "unsupported";

export interface FileNode {
  kind: "file";
  name: string;
  path: string;
  type: FileType;
  content: string;
}

export interface FolderNode {
  kind: "folder";
  name: string;
  children: TreeNode[];
}

export type TreeNode = FileNode | FolderNode;
