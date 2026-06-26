import type { fetchProject } from "@/lib/api";

import "../../projects.css"
interface ProjectDetailHeaderProps {
  project: Awaited<ReturnType<typeof fetchProject>>;
  onBack: () => void;
  onNewRun: () => void;
}

export function ProjectDetailHeader({
  project,
  onBack,
  onNewRun,
}: ProjectDetailHeaderProps) {
  return (
    <div className="project-detail-header">
      <div className="project-detail-info">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            className="btn btn-ghost"
            onClick={onBack}
            style={{ padding: "0.5rem" }}
            title="Back to projects"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <span
            className="material-icons-round"
            style={{ fontSize: "2rem", color: "var(--primary)" }}
          >
            folder
          </span>
          <h1 className="project-detail-name">{project.name}</h1>
        </div>

        {project.description && (
          <p className="project-detail-description">{project.description}</p>
        )}

        <div className="project-detail-meta">
          <span>
            <span className="material-icons-round">schedule</span>
            Created {new Date(project.created_at_iso).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn btn-primary" onClick={onNewRun}>
          <span className="material-icons-round">add</span>
          New Run
        </button>
      </div>
    </div>
  );
}