import "./Header.css";

const MENU_ITEMS = ["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"];

interface HeaderProps {
  fileName?: string;
}

export function Header({ fileName }: HeaderProps) {
  return (
    <header className="vscode-header">
      <div className="vscode-header-left">
        <img src="/images/vscode-icon.svg" alt="VSCode" className="vscode-appicon" />
        <nav className="vscode-menu-bar">
          {MENU_ITEMS.map((item) => (
            <span key={item} className="vscode-menu-item">{item}</span>
          ))}
        </nav>
      </div>

      <div className="vscode-header-center">
        <div className="vscode-title-search">
          <svg className="vscode-title-search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>
          <span className="vscode-title-search-text">
            {fileName ? `${fileName} — Open Symbol...` : "Search files by name (⌘P)"}
          </span>
        </div>
      </div>

      <div className="vscode-header-right">
        <button className="vscode-winbtn vscode-winbtn--min" aria-label="Minimize" title="Minimize">
          <svg viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="5.5" width="10" height="1" /></svg>
        </button>
        <button className="vscode-winbtn vscode-winbtn--max" aria-label="Maximize" title="Maximize">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1"><rect x="1.5" y="1.5" width="9" height="9" /></svg>
        </button>
        <button className="vscode-winbtn vscode-winbtn--close" aria-label="Close" title="Close">
          <svg viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" /></svg>
        </button>
      </div>
    </header>
  );
}
