interface StatBarItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

interface StatsBarProps {
  projects: number;
  subprojects: number;
  updates: number;
  documents: number;
}

export function StatsBar({ projects, subprojects, updates, documents }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <StatBarItem
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
        }
        value={projects}
        label="Projects"
      />
      <StatBarItem
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        }
        value={subprojects}
        label="Subprojects"
      />
      <StatBarItem
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        }
        value={updates}
        label="Updates"
      />
      <StatBarItem
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        }
        value={documents}
        label="Documents"
      />
    </div>
  );
}

function StatBarItem({ icon, value, label }: StatBarItemProps) {
  return (
    <div className="stat-item-compact">
      <div className="stat-icon-small">{icon}</div>
      <div className="stat-data-compact">
        <div className="stat-value-compact">{value}</div>
        <div className="stat-label-compact">{label}</div>
      </div>
    </div>
  );
}

export default StatsBar;
