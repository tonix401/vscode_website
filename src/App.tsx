import { useState, useCallback } from "react";
import "./App.css";
import { type FileNode, type TreeNode } from "./services/types";
import folderFiles from "virtual:open-folder-files";
import { Header } from "./components/Header";
import { ActivityBar, type Panel } from "./components/ActivityBar";
import { Sidebar } from "./components/Sidebar";
import { Explorer } from "./components/Explorer";
import { Content } from "./components/Content";
import { Footer } from "./components/Footer";

function findFirstFile(nodes: TreeNode[]): FileNode | null {
  for (const node of nodes) {
    if (node.kind === "file") return node;
    const found = findFirstFile(node.children);
    if (found) return found;
  }
  return null;
}

function findFileByPath(nodes: TreeNode[], path: string): FileNode | null {
  for (const node of nodes) {
    if (node.kind === "file" && node.path === path) return node;
    if (node.kind === "folder") {
      const found = findFileByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

function resolvePath(fromPath: string, href: string): string {
  const dir = fromPath.split("/").slice(0, -1);
  for (const part of href.split("/")) {
    if (part === "..") dir.pop();
    else if (part !== ".") dir.push(part);
  }
  return dir.join("/");
}

function PlaceholderPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="vscode-panel-placeholder">
      <div className="vscode-explorer-heading">{title}</div>
      <p className="vscode-panel-placeholder-msg">{message}</p>
    </div>
  );
}

const STORAGE_KEY = "vscode-website:selectedFilePath";

function App() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = findFileByPath(folderFiles, saved);
      if (found) return found;
    }
    return findFirstFile(folderFiles);
  });
  const [activePanel, setActivePanel] = useState<Panel>("explorer");

  const handleSelect = useCallback((file: FileNode) => {
    localStorage.setItem(STORAGE_KEY, file.path);
    setSelectedFile(file);
  }, []);

  const handleNavigate = useCallback((href: string) => {
    if (!selectedFile) return;
    const resolved = resolvePath(selectedFile.path, href);
    const target = findFileByPath(folderFiles, resolved);
    if (target) handleSelect(target);
  }, [selectedFile, handleSelect]);

  const resolveFile = useCallback((fromPath: string, href: string) => {
    return findFileByPath(folderFiles, resolvePath(fromPath, href));
  }, []);

  return (
    <div className="vscode-layout">
      <Header fileName={selectedFile?.name} filePath={selectedFile?.path} />
      <div className="vscode-body">
        <ActivityBar activePanel={activePanel} onPanelChange={setActivePanel} />
        <Sidebar>
          {activePanel === "explorer" && (
            <Explorer
              nodes={folderFiles}
              selectedFile={selectedFile}
              onSelect={handleSelect}
            />
          )}
          {activePanel === "search" && (
            <PlaceholderPanel title="SEARCH" message="Type to search across files." />
          )}
          {activePanel === "scm" && (
            <PlaceholderPanel title="SOURCE CONTROL" message="No source control providers registered." />
          )}
          {activePanel === "debug" && (
            <PlaceholderPanel title="RUN AND DEBUG" message="No launch configuration." />
          )}
          {activePanel === "extensions" && (
            <PlaceholderPanel title="EXTENSIONS" message="Search extensions in Marketplace." />
          )}
        </Sidebar>
        <Content file={selectedFile} onNavigate={handleNavigate} resolveFile={resolveFile} />
      </div>
      <Footer file={selectedFile} />
    </div>
  );
}

export default App;
