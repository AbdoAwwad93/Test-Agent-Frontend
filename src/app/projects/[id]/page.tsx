"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProject,
  fetchProjectRuns,
  type RunRecord,
} from "@/lib/api";
import { RunCard } from "@/features/history/components/RunCard";
import "../../../features/projects/projects.css";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
  });

  const {
    data: runs = [],
    isLoading: runsLoading,
  } = useQuery<RunRecord[]>({
    queryKey: ["project-runs", id],
    queryFn: () => fetchProjectRuns(id),
  });

  const runStats = useMemo(() => {
    const total = runs.length;
    const passed = runs.filter((r) => r.overall_status === "pass").length;
    const failed = runs.filter((r) => r.overall_status === "fail").length;
    const pending = runs.filter((r) => r.overall_status === "pending" || r.overall_status === "running").length;
    return { total, passed, failed, pending };
  }, [runs]);

  if (projectLoading) {
    return (
      <div className="page active">
        <div className="skeleton-list">
          <div className="skeleton" style={{ height: "100px" }}></div>
          <div className="skeleton" style={{ height: "60px" }}></div>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="page active">
        <div className="empty-state">
          <p><strong>Project not found.</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="project-detail-header">
        <div className="project-detail-info">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              className="btn btn-ghost"
              onClick={() => router.push("/projects")}
              style={{ padding: "0.5rem" }}
              title="Back to projects"
            >
              <span className="material-icons-round">arrow_back</span>
            </button>
            <span className="material-icons-round" style={{ fontSize: "2rem", color: "var(--primary)" }}>folder</span>
            <h1 className="project-detail-name">{project.name}</h1>
          </div>
          {project.description && (
            <p className="project-detail-description">
              {project.description}
            </p>
          )}
          <div className="project-detail-meta">
            <span>
              <span className="material-icons-round">schedule</span>
              Created {new Date(project.created_at_iso).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => router.push(`/runs/new?project_id=${project.id}`)}
          >
            <span className="material-icons-round">add</span>
            New Run
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <span className="stat-label">Total Runs</span>
          <span className="stat-value">{runStats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Passed</span>
          <span className="stat-value accent" style={{ color: "var(--pass)" }}>{runStats.passed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Failed</span>
          <span className="stat-value" style={{ color: "var(--fail)" }}>{runStats.failed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In Progress</span>
          <span className="stat-value" style={{ color: "var(--warn)" }}>{runStats.pending}</span>
        </div>
      </div>

      {runsLoading ? (
        <div className="skeleton-list">
          <div className="skeleton"></div>
          <div className="skeleton"></div>
        </div>
      ) : runs.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons-round" style={{ fontSize: "3rem", color: "var(--text-muted)" }}>play_circle</span>
          <p><strong>No runs in this project yet.</strong></p>
          <p>Create a new run to get started.</p>
          {/* <button
            className="btn btn-primary"
            onClick={() => router.push(`/runs/new?project_id=${project.id}`)}
            style={{ marginTop: "0.75rem" }}
          >
            <span className="material-icons-round">add</span>
            New Run
          </button> */}
        </div>
      ) : (
        <div className="history-list">
          {runs.map((run) => (
            <RunCard key={run.id} run={run} onClick={() => router.push(`/runs/${run.id}`)} hideProject />
          ))}
        </div>
      )}
    </div>
  );
}
