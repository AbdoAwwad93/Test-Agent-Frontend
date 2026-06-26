"use client";

import { type ProjectRecord } from "@/lib/api";
import { ProjectCard } from "./ProjectCard";
import "../projects.css"
interface ProjectsGridProps {
  projects: ProjectRecord[];
  onProjectClick: (projectId: string) => void;
  onCreateClick: () => void;
}

export function ProjectsGrid({
  projects,
  onProjectClick,
  onCreateClick,
}: ProjectsGridProps) {
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project.id)}
        />
      ))}
      <div className="create-project-card" onClick={onCreateClick}>
        <span className="material-icons-round" style={{ fontSize: "2.5rem" }}>
          add_circle
        </span>
        <span style={{ fontWeight: 500 }}>Create Project</span>
      </div>
    </div>
  );
}