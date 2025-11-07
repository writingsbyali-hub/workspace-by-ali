import StatCard from '../ui/StatCard';

interface StatsGridProps {
  stats: {
    projects: number;
    updates: number;
    subProjects: number;
    collaborators: number;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats-grid">
      <StatCard
        title="Projects"
        value={stats.projects}
        description="Active research projects"
      />
      <StatCard
        title="Updates"
        value={stats.updates}
        description="Published this month"
      />
      <StatCard
        title="Sub-Projects"
        value={stats.subProjects}
        description="Active sub-projects"
      />
      <StatCard
        title="Collaborators"
        value={stats.collaborators}
        description="Team members"
      />
    </div>
  );
}
