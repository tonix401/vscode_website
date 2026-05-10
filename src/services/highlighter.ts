import { getSingletonHighlighter } from "shiki";
import type { BundledLanguage, SpecialLanguage } from "shiki";
import type { FileType } from "./types";

export type { ThemedToken } from "shiki";

export const highlighterReady = getSingletonHighlighter({
  themes: ["dark-plus"],
  langs: [
    "html", "css", "javascript", "typescript", "tsx", "jsx",
    "markdown", "python", "json", "yaml", "rust", "go", "bash",
    "php", "ruby", "c", "cpp", "java", "sql", "xml", "toml",
    "vue", "svelte",
  ],
});

export function langFromType(type: FileType): BundledLanguage | SpecialLanguage {
  switch (type) {
    case "html":   return "html";
    case "css":    return "css";
    case "js":     return "javascript";
    case "ts":     return "typescript";
    case "tsx":    return "tsx";
    case "jsx":    return "jsx";
    case "md":     return "markdown";
    case "py":     return "python";
    case "json":   return "json";
    case "yaml":   return "yaml";
    case "rs":     return "rust";
    case "go":     return "go";
    case "sh":     return "bash";
    case "php":    return "php";
    case "rb":     return "ruby";
    case "c":      return "c";
    case "cpp":    return "cpp";
    case "java":   return "java";
    case "sql":    return "sql";
    case "xml":    return "xml";
    case "toml":   return "toml";
    case "vue":    return "vue";
    case "svelte": return "svelte";
    default:       return "text";
  }
}
