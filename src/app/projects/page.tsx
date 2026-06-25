"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, createProject, type ProjectRecord } from "@/lib/api";
import "./projects.css";

export default function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { data: projects = [], isLoading, isError } = useQuery<ProjectRecord[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: () => createProject(newName, newDesc || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    },
  });

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            Group your test runs into projects for better organization.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}
          >
            <span className="material-icons-round">add</span>
            New Project
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="skeleton-list">
          <div className="skeleton" style={{ height: "160px" }}></div>
          <div className="skeleton" style={{ height: "160px" }}></div>
          <div className="skeleton" style={{ height: "160px" }}></div>
        </div>
      ) : isError ? (
        <div className="empty-state">
          <p>Could not load projects. Please try again.</p>
        </div>
      ) : (
        projects.length === 0 ? (
          <div className="empty-projects">
            <div className="create-project-card" onClick={() => setShowCreate(true)}>
              <span className="material-icons-round" style={{ fontSize: "2.5rem" }}>add_circle</span>
              <span style={{ fontWeight: 500 }}>Create your first Project</span>
            </div>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
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
            ))}
            <div className="create-project-card" onClick={() => setShowCreate(true)}>
              <span className="material-icons-round" style={{ fontSize: "2.5rem" }}>add_circle</span>
              <span style={{ fontWeight: 500 }}>Create Project</span>
            </div>
          </div>
        )
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-title">New Project</span>
            <div className="form-group">
              <label className="form-label" htmlFor="project-name">
                <span className="material-icons-round">badge</span>
                Name
              </label>
              <input
                id="project-name"
                type="text"
                className="form-input"
                placeholder="My Project"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="project-desc">
                <span className="material-icons-round">description</span>
                Description (optional)
              </label>
              <textarea
                id="project-desc"
                className="form-textarea"
                placeholder="What is this project about?"
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => createMutation.mutate()}
                disabled={!newName.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </button>
            </div>
            {createMutation.isError && (
              <div className="form-error">
                <span className="material-icons-round">error_outline</span>
                <span>{(createMutation.error as Error).message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
