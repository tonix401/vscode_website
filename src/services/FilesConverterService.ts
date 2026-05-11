import { type Plugin } from "vite";
import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { resolve, extname } from "path";
import { type FileType, type TreeNode } from "./types";
import {
  KNOWN_PLACEHOLDERS,
  detectUnknownPlaceholders,
  resolveConfigSearchBarText,
  transformHtml,
} from "../utils/pluginHelpers";
import { langHintToFileType } from "../utils/fileTypes";

export type { FileNode, FolderNode, TreeNode } from "./types";

export interface OpenFolderPluginOptions {
  folderPath?: string;
  searchBarText?: string;
  rootFolderName?: string;
  websiteTitle?: string;
  faviconPath?: string;
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
      if (node.type === "md") {
        for (const lang of collectMdCodeFenceLangs(node.content)) types.add(lang);
      }
    } else {
      for (const t of collectFileTypes(node.children)) types.add(t);
    }
  }
  return types;
}

function getFileType(fileName: string): FileType {
  return langHintToFileType(extname(fileName).slice(1));
}

export function collectMdCodeFenceLangs(content: string): FileType[] {
  const result: FileType[] = [];
  const seen = new Set<FileType>();
  const fence = /^`{3,}(\w+)/gm;
  let match;
  while ((match = fence.exec(content)) !== null) {
    const type = langHintToFileType(match[1]);
    if (type !== "unsupported" && !seen.has(type)) {
      seen.add(type);
      result.push(type);
    }
  }
  return result;
}

function stripSortPrefix(name: string): string {
  return name.replace(/^\d+#/, "");
}

function findExtensionlessFiles(dirPath: string, relPath: string = ""): string[] {
  const results: string[] = [];
  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const entryRel = relPath ? `${relPath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...findExtensionlessFiles(resolve(dirPath, entry.name), entryRel));
    } else {
      const displayName = stripSortPrefix(entry.name);
      if (!displayName.startsWith(".") && extname(displayName) === "") {
        results.push(entryRel);
      }
    }
  }
  return results;
}

function findMalformedPrefixes(dirPath: string, relPath: string = ""): string[] {
  const results: string[] = [];
  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const entryRel = relPath ? `${relPath}/${entry.name}` : entry.name;
    if (/^\w+#/.test(entry.name) && !/^\d+#/.test(entry.name)) {
      results.push(entryRel);
    }
    if (entry.isDirectory()) {
      results.push(...findMalformedPrefixes(resolve(dirPath, entry.name), entryRel));
    }
  }
  return results;
}

function readTree(dirPath: string, prefix: string = ""): TreeNode[] {
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    const nodes: TreeNode[] = [];

    for (const entry of entries) {
      const fullPath = resolve(dirPath, entry.name);
      const displayName = stripSortPrefix(entry.name);
      const entryPath = prefix ? `${prefix}/${displayName}` : displayName;

      if (entry.isDirectory()) {
        nodes.push({
          kind: "folder",
          name: displayName,
          children: readTree(fullPath, entryPath),
        });
      } else {
        const type = getFileType(entry.name);
        nodes.push({
          kind: "file",
          name: displayName,
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
  const {
    folderPath = "./src/open_folder",
    searchBarText = "Search files by name (⌘P)",
    rootFolderName = "WEBSITE",
    websiteTitle,
    faviconPath,
  } = options;

  const filesModuleId = "virtual:open-folder-files";
  const langsModuleId = "virtual:open-folder-langs";
  const configModuleId = "virtual:open-folder-config";
  const resolvedFilesId = "\0" + filesModuleId;
  const resolvedLangsId = "\0" + langsModuleId;
  const resolvedConfigId = "\0" + configModuleId;

  return {
    name: "vite-plugin-open-folder",

    buildStart() {
      const absFolder = resolve(folderPath);

      if (!existsSync(absFolder)) {
        this.error(
          `folderPath "${folderPath}" does not exist.\n` +
            `  This path resolves to: ${absFolder}\n` +
            `  Fix: Create that directory, or update folderPath in vite.config.ts to point at an existing folder.`,
        );
      } else if (!statSync(absFolder).isDirectory()) {
        this.error(
          `folderPath "${folderPath}" points to a file, not a folder.\n` +
            `  This path resolves to: ${absFolder}\n` +
            `  Fix: Update folderPath in vite.config.ts to point at a directory, not a file.`,
        );
      }

      if (rootFolderName.trim() === "") {
        this.warn(
          `rootFolderName is an empty string.\n` +
          `  The explorer sidebar will show the root folder with no label.\n` +
          `  Fix: Set it to a non-empty string, e.g. rootFolderName: "MY PROJECT".\n` +
          `  Or remove the option entirely — it defaults to "WEBSITE".`,
        );
      }

      if (searchBarText.trim() === "") {
        this.warn(
          `searchBarText is an empty string.\n` +
          `  The search bar will appear with no placeholder text.\n` +
          `  Fix: Set it to a non-empty string, e.g. searchBarText: "Search files (⌘P)".\n` +
          `  Or remove the option entirely — it defaults to "Search files by name (⌘P)".`,
        );
      }

      const unknownPlaceholders = detectUnknownPlaceholders(searchBarText);
      if (unknownPlaceholders.length > 0) {
        this.warn(
          `searchBarText contains unknown placeholder(s): ${unknownPlaceholders.join(", ")}\n` +
            `  These will appear as-is in the search bar instead of being replaced.\n` +
            `  Fix: Use only known placeholders: ${KNOWN_PLACEHOLDERS.join(", ")}`,
        );
      }

      if (
        faviconPath !== undefined &&
        !faviconPath.startsWith("/") &&
        !/^https?:\/\//.test(faviconPath)
      ) {
        this.warn(
          `faviconPath "${faviconPath}" is a relative path, which may not resolve correctly in the browser.\n` +
            `  Fix: Use a root-relative path starting with "/", e.g. "/favicon.svg".\n` +
            `  Or use a full URL starting with "https://".`,
        );
      }

      const extensionless = findExtensionlessFiles(absFolder);
      if (extensionless.length > 0) {
        this.warn(
          `The following files have no extension and will be shown as plain text without syntax highlighting:\n` +
            extensionless.map((p) => `  ${p}`).join("\n") + "\n" +
            `  Fix: Add an extension that matches the file's content, e.g. rename "LICENCE" to "LICENCE.md".`,
        );
      }

      const malformed = findMalformedPrefixes(absFolder);
      if (malformed.length > 0) {
        this.warn(
          `The following files/folders have a malformed sort prefix (expected digits only before "#"):\n` +
            malformed.map((p) => `  ${p}`).join("\n") + "\n" +
            `  Fix: Use only digits before "#", e.g. rename "0a2#file.md" to "002#file.md".`,
        );
      }
    },

    resolveId(id) {
      if (id === filesModuleId) return resolvedFilesId;
      if (id === langsModuleId) return resolvedLangsId;
      if (id === configModuleId) return resolvedConfigId;
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
        const imports = pkgs
          .map((pkg) => `  import(${JSON.stringify(pkg)})`)
          .join(",\n");
        return `export default [\n${imports}\n];`;
      }

      if (id === resolvedConfigId) {
        const resolvedSearchBarText = resolveConfigSearchBarText(
          searchBarText,
          rootFolderName,
          websiteTitle,
        );
        return [
          `export const searchBarText = ${JSON.stringify(resolvedSearchBarText)};`,
          `export const rootFolderName = ${JSON.stringify(rootFolderName)};`,
        ].join("\n");
      }
    },

    configureServer(server) {
      const absFolder = resolve(folderPath);
      server.watcher.add(absFolder);

      server.watcher.on("all", (_event, changedPath) => {
        if (!changedPath.startsWith(absFolder)) return;

        for (const id of [resolvedFilesId, resolvedLangsId, resolvedConfigId]) {
          const mod = server.moduleGraph.getModuleById(id);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }

        server.ws.send({ type: "full-reload" });
      });
    },

    transformIndexHtml(html) {
      return transformHtml(html, websiteTitle, faviconPath);
    },
  };
}
