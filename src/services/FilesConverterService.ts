import { type Plugin } from "vite";
import { readdirSync, readFileSync } from "fs";
import { resolve, extname } from "path";
import { type FileType, type TreeNode } from "./types";

export type { FileNode, FolderNode, TreeNode } from "./types";

export interface OpenFolderPluginOptions {
  folderPath?: string;
}

const fileTypeToShikiLang: Partial<Record<FileType, string>> = {
  html: "@shikijs/langs/html",
  css: "@shikijs/langs/css",
  js: "@shikijs/langs/javascript",
  ts: "@shikijs/langs/typescript",
  tsx: "@shikijs/langs/tsx",
  jsx: "@shikijs/langs/jsx",
  md: "@shikijs/langs/markdown",
  py: "@shikijs/langs/python",
  json: "@shikijs/langs/json",
  yaml: "@shikijs/langs/yaml",
  rs: "@shikijs/langs/rust",
  go: "@shikijs/langs/go",
  sh: "@shikijs/langs/bash",
  php: "@shikijs/langs/php",
  rb: "@shikijs/langs/ruby",
  c: "@shikijs/langs/c",
  cpp: "@shikijs/langs/cpp",
  java: "@shikijs/langs/java",
  sql: "@shikijs/langs/sql",
  xml: "@shikijs/langs/xml",
  toml: "@shikijs/langs/toml",
  vue: "@shikijs/langs/vue",
  svelte: "@shikijs/langs/svelte",
};

function collectFileTypes(nodes: TreeNode[]): Set<FileType> {
  const types = new Set<FileType>();
  for (const node of nodes) {
    if (node.kind === "file") {
      types.add(node.type);
    } else {
      for (const t of collectFileTypes(node.children)) types.add(t);
    }
  }
  return types;
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

  const filesModuleId = "virtual:open-folder-files";
  const langsModuleId = "virtual:open-folder-langs";
  const resolvedFilesId = "\0" + filesModuleId;
  const resolvedLangsId = "\0" + langsModuleId;

  return {
    name: "vite-plugin-open-folder",

    resolveId(id) {
      if (id === filesModuleId) return resolvedFilesId;
      if (id === langsModuleId) return resolvedLangsId;
    },

    load(id) {
      const tree = readTree(resolve(folderPath));

      if (id === resolvedFilesId) {
        return `export default ${JSON.stringify(tree)};`;
      }

      if (id === resolvedLangsId) {
        const types = collectFileTypes(tree);
        const pkgs = [...types]
          .map((t) => fileTypeToShikiLang[t])
          .filter((p): p is string => p !== undefined);
        const imports = pkgs.map((pkg) => `  import(${JSON.stringify(pkg)})`).join(",\n");
        return `export default [\n${imports}\n];`;
      }
    },
  };
}
