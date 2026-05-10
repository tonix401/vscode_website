import { type Plugin } from "vite";
import { readdirSync, readFileSync } from "fs";
import { resolve, extname } from "path";
import { type FileType, type TreeNode } from "./types";

export type { FileNode, FolderNode, TreeNode } from "./types";

export interface OpenFolderPluginOptions {
  folderPath?: string;
}

function getFileType(fileName: string): FileType {
  const ext = extname(fileName).slice(1).toLowerCase();
  switch (ext) {
    case "html":             return "html";
    case "css":              return "css";
    case "js":               return "js";
    case "ts":               return "ts";
    case "tsx":              return "tsx";
    case "jsx":              return "jsx";
    case "md":               return "md";
    case "py":               return "py";
    case "json":             return "json";
    case "yml":
    case "yaml":             return "yaml";
    case "rs":               return "rs";
    case "go":               return "go";
    case "sh":
    case "bash":             return "sh";
    case "php":              return "php";
    case "rb":               return "rb";
    case "c":
    case "h":                return "c";
    case "cpp":
    case "hpp":              return "cpp";
    case "java":             return "java";
    case "sql":              return "sql";
    case "xml":              return "xml";
    case "toml":             return "toml";
    case "vue":              return "vue";
    case "svelte":           return "svelte";
    default:                 return "unsupported";
  }
}

function readTree(dirPath: string, prefix: string = ""): TreeNode[] {
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    const nodes: TreeNode[] = [];

    for (const entry of entries) {
      const fullPath = resolve(dirPath, entry.name);
      const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        nodes.push({
          kind: "folder",
          name: entry.name,
          children: readTree(fullPath, entryPath),
        });
      } else {
        const type = getFileType(entry.name);
        nodes.push({
          kind: "file",
          name: entry.name,
          path: entryPath,
          type,
          content: readFileSync(fullPath, "utf-8"),
        });
      }
    }

    return nodes;
  } catch (error) {
    console.error(
      `Error reading ${dirPath}:`,
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export function openFolderPlugin(
  options: OpenFolderPluginOptions = {},
): Plugin {
  const { folderPath = "./src/open_folder" } = options;

  const virtualModuleId = "virtual:open-folder-files";
  const resolvedId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-open-folder",

    resolveId(id) {
      if (id === virtualModuleId) return resolvedId;
    },

    load(id) {
      if (id === resolvedId) {
        const tree = readTree(resolve(folderPath));
        return `export default ${JSON.stringify(tree)};`;
      }
    },
  };
}
