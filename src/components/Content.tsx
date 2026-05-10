import { useState, useEffect } from "react";
import "./Content.css";
import type { ThemedToken } from "shiki";
import { type FileNode } from "../services/types";
import { highlighterReady, langFromType } from "../services/highlighter";
import { SetiIcon } from "./SetiIcon";

interface ContentProps {
  file: FileNode | null;
}

function Breadcrumb({ file }: { file: FileNode }) {
  const parts = file.path.split("/");
  return (
    <div className="vscode-breadcrumb">
      <span className="vscode-breadcrumb-item">WEBSITE</span>
      {parts.map((part, i) => {
        const isFile = i === parts.length - 1;
        return (
          <span key={i} className="vscode-breadcrumb-segment">
            <span className="vscode-breadcrumb-sep">›</span>
            {isFile && <SetiIcon type={file.type} size={16} />}
            <span className={isFile ? "vscode-breadcrumb-item vscode-breadcrumb-item--file" : "vscode-breadcrumb-item"}>
              {part}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function tokenStyle(token: ThemedToken): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (token.color) style.color = token.color;
  if (token.fontStyle) {
    if (token.fontStyle & 1) style.fontStyle = "italic";
    if (token.fontStyle & 2) style.fontWeight = "bold";
    if (token.fontStyle & 4) style.textDecoration = "underline";
  }
  return style;
}

export function Content({ file }: ContentProps) {
  const [tokenLines, setTokenLines] = useState<ThemedToken[][] | null>(null);

  useEffect(() => {
    if (!file) {
      setTokenLines(null);
      return;
    }
    let cancelled = false;
    highlighterReady.then((hl) => {
      if (cancelled) return;
      const result = hl.codeToTokens(file.content, {
        lang: langFromType(file.type),
        theme: "dark-plus",
      });
      setTokenLines(result.tokens);
    });
    return () => {
      cancelled = true;
    };
  }, [file]);

  if (!file) {
    return (
      <main className="vscode-content vscode-content--empty">
        <span>Select a file to view its contents.</span>
      </main>
    );
  }

  const lines = file.content.split("\n");

  return (
    <main className="vscode-content">
      <div className="vscode-tab-bar">
        <div className="vscode-tab vscode-tab--active">
          <SetiIcon type={file.type} />
          <span>{file.name}</span>
        </div>
      </div>
      <Breadcrumb file={file} />
      <div className="vscode-editor-area">
        <div className="vscode-line-numbers" aria-hidden="true">
          {lines.map((_, i) => (
            <div key={i} className="vscode-line-number">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="vscode-code-area" style={tokenLines ? undefined : { opacity: 0.35 }}>
          {lines.map((line, i) => {
            const tokens = tokenLines?.[i];
            return (
              <div key={i} className="vscode-line">
                {tokens && tokens.length > 0
                  ? tokens.map((token, j) => (
                      <span key={j} style={tokenStyle(token)}>
                        {token.content}
                      </span>
                    ))
                  : (line || " ")}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
