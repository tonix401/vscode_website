import "./ActivityBar.css";

export type Panel = "explorer" | "search" | "scm" | "debug" | "extensions";

interface ActivityBarProps {
  activePanel: Panel | null;
  onPanelChange: (panel: Panel) => void;
}

interface IconButtonProps {
  panel?: Panel;
  active?: boolean;
  title: string;
  icon: string;
  onClick: () => void;
}

function IconButton({ active, title, icon, onClick }: IconButtonProps) {
  return (
    <button
      className={`vscode-activity-btn${active ? " vscode-activity-btn--active" : ""}`}
      title={title}
      onClick={onClick}
      aria-label={title}
    >
      <img src={icon} alt="" />
    </button>
  );
}

export function ActivityBar({ activePanel, onPanelChange }: ActivityBarProps) {
  const toggle = (panel: Panel) => onPanelChange(panel);

  return (
    <div className="vscode-activity-bar">
      <div className="vscode-activity-bar-top">
        <IconButton active={activePanel === "explorer"} title="Explorer" icon="/images/files.svg" onClick={() => toggle("explorer")} />
        <IconButton active={activePanel === "search"} title="Search" icon="/images/search.svg" onClick={() => toggle("search")} />
        <IconButton active={activePanel === "scm"} title="Source Control" icon="/images/source-control.svg" onClick={() => toggle("scm")} />
        <IconButton active={activePanel === "debug"} title="Run and Debug" icon="/images/debug-alt.svg" onClick={() => toggle("debug")} />
        <IconButton active={activePanel === "extensions"} title="Extensions" icon="/images/extensions.svg" onClick={() => toggle("extensions")} />
      </div>
      <div className="vscode-activity-bar-bottom">
        <IconButton title="Accounts" icon="/images/account.svg" onClick={() => {}} />
        <IconButton title="Manage" icon="/images/settings-gear.svg" onClick={() => {}} />
      </div>
    </div>
  );
}
