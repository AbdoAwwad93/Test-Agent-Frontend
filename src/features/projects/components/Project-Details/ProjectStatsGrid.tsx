import type { RunStats } from "../../hooks/UseProjectDetail";
import "../../projects.css"

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

interface ProjectStatsGridProps {
  stats: RunStats;
}

export function ProjectStatsGrid({ stats }: ProjectStatsGridProps) {
  return (
    <div className="stats-grid" style={{ marginBottom: "2rem" }}>
      <StatCard label="Total Runs" value={stats.total} />
      <StatCard label="Passed" value={stats.passed} color="var(--pass)" />
      <StatCard label="Failed" value={stats.failed} color="var(--fail)" />
      <StatCard label="In Progress" value={stats.pending} color="var(--warn)" />
    </div>
  );
}