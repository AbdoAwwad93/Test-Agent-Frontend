import { RunCard } from "@/features/history/components/RunCard";
import type { RunRecord } from "@/lib/api";
import "../../projects.css"

interface ProjectRunsListProps {
  runs: RunRecord[];
  isLoading: boolean;
  onRunClick: (runId: string) => void;
}

function RunsSkeleton() {
  return (
    <div className="skeleton-list">
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}

function EmptyRuns() {
  return (
    <div className="empty-state">
      <span
        className="material-icons-round"
        style={{ fontSize: "3rem", color: "var(--text-muted)" }}
      >
        play_circle
      </span>
      <p>
        <strong>No runs in this project yet.</strong>
      </p>
      <p>Create a new run to get started.</p>
    </div>
  );
}

export function ProjectRunsList({
  runs,
  isLoading,
  onRunClick,
}: ProjectRunsListProps) {
  if (isLoading) return <RunsSkeleton />;
  if (runs.length === 0) return <EmptyRuns />;

  return (
    <div className="history-list">
      {runs.map((run) => (
        <RunCard
          key={run.id}
          run={run}
          onClick={() => onRunClick(run.id)}
          hideProject
        />
      ))}
    </div>
  );
}