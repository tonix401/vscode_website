import React, { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import "./editor.css";

/**
 * FileTab component - renders individual file tabs
 */
const FileTab = memo(({ name, isActive, onSelect, onClose }) => (
  <div className={`file-tab ${isActive ? "active" : ""}`} onClick={onSelect}>
    <span className="tab-name">{name}</span>
    <button
      className="tab-close"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      aria-label="Close tab"
    >
      ×
    </button>
  </div>
));

FileTab.propTypes = {
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * CodeEditor component - main editor container
 */
export function CodeEditor({ files = [], onFileSelect, theme = "dark" }) {
  const [activeTab, setActiveTab] = useState(files[0]?.id ?? null);

  const handleSelectTab = useCallback(
    (fileId) => {
      setActiveTab(fileId);
      onFileSelect?.(fileId);
    },
    [onFileSelect]
  );

  const handleCloseTab = useCallback((fileId) => {
    setActiveTab((prev) => (prev === fileId ? files[0]?.id ?? null : prev));
  }, [files]);

  const activeFile = files.find((f) => f.id === activeTab);

  return (
    <div className={`editor-container theme-${theme}`}>
      <div className="editor-tabs">
        {files.map((file) => (
          <FileTab
            key={file.id}
            name={file.name}
            isActive={activeTab === file.id}
            onSelect={() => handleSelectTab(file.id)}
            onClose={() => handleCloseTab(file.id)}
          />
        ))}
      </div>

      <div className="editor-content">
        {activeFile && (
          <pre>
            <code>{activeFile.content}</code>
          </pre>
        )}
      </div>

      <div className="editor-footer">
        <span>
          {activeFile?.language ?? "unknown"} • {files.length} file
          {files.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

CodeEditor.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      language: PropTypes.string,
      content: PropTypes.string.isRequired,
    })
  ),
  onFileSelect: PropTypes.func,
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default CodeEditor;
