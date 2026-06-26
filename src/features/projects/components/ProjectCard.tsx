"use client";

import { type ProjectRecord } from "@/lib/api";
import "../projects.css"
interface ProjectCardProps {
  project: ProjectRecord;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-header">
        <span className="material-icons-round">folder</span>
        <span className="project-card-name">{project.name}</span>
      </div>
      {project.description && (
        <div className="project-card-description">{project.description}</div>
      )}
      <div className="project-card-meta">
        <span>
          <span className="material-icons-round">play_circle</span>
          {project.run_count} run{project.run_count !== 1 ? "s" : ""}
        </span>
        <span>
          <span className="material-icons-round">schedule</span>
          {new Date(project.created_at_iso).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}