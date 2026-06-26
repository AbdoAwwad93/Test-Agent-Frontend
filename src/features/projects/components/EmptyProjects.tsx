"use client";

import"../projects.css"
interface EmptyProjectsProps {
  onCreateClick: () => void;
}

export function EmptyProjects({ onCreateClick }: EmptyProjectsProps) {
  return (
    <div className="empty-projects">
      <div className="create-project-card" onClick={onCreateClick}>
        <span className="material-icons-round" style={{ fontSize: "2.5rem" }}>
          add_circle
        </span>
        <span style={{ fontWeight: 500 }}>Create your first Project</span>
      </div>
    </div>
  );
}