interface HeaderProps {
  lastUpdated: number | null;
  onRefresh: () => void;
  strangersOnly: boolean;
  onToggleStrangers: () => void;
  projectCount: number;
  loading: boolean;
}

export default function Header({
  lastUpdated,
  onRefresh,
  strangersOnly,
  onToggleStrangers,
  projectCount,
  loading,
}: HeaderProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return '刚刚';
    }
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} 分钟前`;
    }
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} 小时前`;
    }
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="site-title">
            <span className="title-icon">
              <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="headerPlanet" cx="35%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#F5D89E"/>
                    <stop offset="40%" stopColor="#E5B95A"/>
                    <stop offset="80%" stopColor="#A67B3A"/>
                    <stop offset="100%" stopColor="#5C3A1A"/>
                  </radialGradient>
                  <linearGradient id="headerRing" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5A2B" stopOpacity="0.5"/>
                    <stop offset="30%" stopColor="#C9933A" stopOpacity="0.95"/>
                    <stop offset="70%" stopColor="#E5B95A" stopOpacity="1"/>
                    <stop offset="100%" stopColor="#8B5A2B" stopOpacity="0.5"/>
                  </linearGradient>
                </defs>
                <g transform="rotate(-20 32 32)">
                  <path d="M 4 32 A 28 5 0 0 0 60 32" stroke="url(#headerRing)" strokeWidth="2.5" fill="none" opacity="0.85"/>
                  <circle cx="32" cy="32" r="13" fill="url(#headerPlanet)"/>
                  <ellipse cx="32" cy="29" rx="12" ry="0.8" fill="#8B5A2B" opacity="0.3"/>
                  <ellipse cx="32" cy="33" rx="12.5" ry="0.8" fill="#8B5A2B" opacity="0.25"/>
                  <ellipse cx="32" cy="36" rx="11" ry="0.7" fill="#8B5A2B" opacity="0.2"/>
                  <path d="M 4 32 A 28 5 0 0 1 60 32" stroke="url(#headerRing)" strokeWidth="2.5" fill="none"/>
                </g>
              </svg>
            </span>
            独立开发者星球
          </h1>
          <p className="site-subtitle">
            发现有趣的独立项目，找到同路人。
            每日聚合 GitHub 和 Product Hunt 的热门作品，
            帮你在浩瀚的代码宇宙中捕捉灵感的流星。
          </p>
          <p className="site-desc">
            💡 「只看陌生人」模式可以过滤大厂和知名项目，
            发现那些藏在角落里的、由独立开发者精心打磨的小而美作品。
          </p>
        </div>

        <div className="header-right">
          <div className="radar-container">
            <div className="radar">
              <div className="radar-dot"></div>
              <div className="radar-sweep"></div>
            </div>
            <span>
              {loading ? '信号接收中...' : `已接收 ${projectCount} 个星际信号`}
            </span>
          </div>

          <div className="header-meta">
            {lastUpdated && (
              <span className="last-update">
                最后更新：{formatTime(lastUpdated)}
              </span>
            )}
          </div>

          <div className="header-actions">
            <button
              className={`toggle-btn ${strangersOnly ? 'active' : ''}`}
              onClick={onToggleStrangers}
              title={strangersOnly ? '显示全部项目' : '只看陌生人（独立开发者作品）'}
            >
              {strangersOnly ? '👤 只看陌生人' : '🌍 全部项目'}
            </button>

            <button
              className="refresh-btn"
              onClick={onRefresh}
              title="重新接收信号"
            >
              ↻ 刷新
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
