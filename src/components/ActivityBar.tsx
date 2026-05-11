import "./ActivityBar.css";
import filesIcon from "@vscode/codicons/src/icons/files.svg";
import searchIcon from "@vscode/codicons/src/icons/search.svg";
import sourceControlIcon from "@vscode/codicons/src/icons/source-control.svg";
import debugAltIcon from "@vscode/codicons/src/icons/debug-alt.svg";
import extensionsIcon from "@vscode/codicons/src/icons/extensions.svg";
import accountIcon from "@vscode/codicons/src/icons/account.svg";
import settingsGearIcon from "@vscode/codicons/src/icons/settings-gear.svg";

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
        <IconButton active={activePanel === "explorer"} title="Explorer" icon={filesIcon} onClick={() => toggle("explorer")} />
        <IconButton active={activePanel === "search"} title="Search" icon={searchIcon} onClick={() => toggle("search")} />
        <IconButton active={activePanel === "scm"} title="Source Control" icon={sourceControlIcon} onClick={() => toggle("scm")} />
        <IconButton active={activePanel === "debug"} title="Run and Debug" icon={debugAltIcon} onClick={() => toggle("debug")} />
        <IconButton active={activePanel === "extensions"} title="Extensions" icon={extensionsIcon} onClick={() => toggle("extensions")} />
      </div>
      <div className="vscode-activity-bar-bottom">
        <IconButton title="Accounts" icon={accountIcon} onClick={() => {}} />
        <IconButton title="Manage" icon={settingsGearIcon} onClick={() => {}} />
      </div>
    </div>
  );
}
