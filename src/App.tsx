import { useState } from "react";
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

function PlaceholderPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="vscode-panel-placeholder">
      <div className="vscode-explorer-heading">{title}</div>
      <p className="vscode-panel-placeholder-msg">{message}</p>
    </div>
  );
}

function App() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(
    () => findFirstFile(folderFiles),
  );
  const [activePanel, setActivePanel] = useState<Panel>("explorer");

  return (
    <div className="vscode-layout">
      <Header fileName={selectedFile?.name} />
      <div className="vscode-body">
        <ActivityBar activePanel={activePanel} onPanelChange={setActivePanel} />
        <Sidebar>
          {activePanel === "explorer" && (
            <Explorer
              nodes={folderFiles}
              selectedFile={selectedFile}
              onSelect={setSelectedFile}
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
        <Content file={selectedFile} />
      </div>
      <Footer file={selectedFile} />
    </div>
  );
}

export default App;
