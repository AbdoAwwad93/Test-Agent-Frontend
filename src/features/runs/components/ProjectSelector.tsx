"use client";

import { type ProjectRecord } from "@/lib/api";

interface ProjectSelectorProps {
  projects: ProjectRecord[];
  projectId: string;
  setProjectId: (id: string) => void;
}

export function ProjectSelector({
  projects,
  projectId,
  setProjectId,
}: ProjectSelectorProps) {
  return (
    <div className="form-group">
      <label className="form-label">
        <span className="material-icons-round">folder</span>
        Project (optional)
      </label>
      <p className="form-hint">
        Associate this run with a project to keep related runs organized.
      </p>
      <select
        className="form-input"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      >
        <option value="">-- No project --</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}