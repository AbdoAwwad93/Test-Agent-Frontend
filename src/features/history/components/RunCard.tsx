"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { type RunRecord, hasMultipleTargets, getRoleBadgeColor, fetchProjects } from "@/lib/api";

interface RunCardProps {
  run: RunRecord;
  onClick: () => void;
  hideProject?: boolean;
}

export function RunCard({ run, onClick, hideProject = false }: RunCardProps) {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const projectMap = useMemo(
    () => new Map(projects.map((p) => [p.id, p.name])),
    [projects]
  );
  return (
    <div className={`run-card ${run.overall_status}`} onClick={onClick}>
      <div className={`run-status-dot ${run.overall_status}`}></div>
      <div className="run-info">
        <div className="run-story">{run.story}</div>
        <div className="run-meta">
          <span className="run-id">{run.id.substring(0, 8)}</span>
          {!hideProject && run.project_id && projectMap.has(run.project_id) && (
            <div className="run-meta-item" onClick={(e) => e.stopPropagation()}>
              <span className="material-icons-round" style={{ fontSize: '1rem' }}>folder</span>
              <Link
                href={`/projects/${run.project_id}`}
                style={{ color: "var(--primary)" }}
              >
                <span style={{ textDecoration: "underline" }}>{projectMap.get(run.project_id)}</span>
              </Link>
            </div>
          )}
          {hasMultipleTargets(run) ? (
            <div className="run-meta-item" style={{ gap: '0.25rem', flexWrap: 'wrap' }}>
              <span className="material-icons-round" style={{ fontSize: '1rem' }}>link</span>
              {run.targets!.map((t, i) => (
                <span
                  key={i}
                  title={t.url}
                  style={{
                    background: t.role ? getRoleBadgeColor(t.role) : '#6b7280',
                    color: '#fff', borderRadius: '999px', padding: '0 0.4rem',
                    fontSize: '0.7rem', lineHeight: '1.3rem',
                  }}
                >
                  {t.role || 'url'}
                </span>
              ))}
            </div>
          ) : (
            <div className="run-meta-item">
              <span className="material-icons-round">link</span>
              {run.url}
            </div>
          )}
          <div className="run-meta-item">
            <span className="material-icons-round">schedule</span>
            {new Date(run.created_at).toLocaleString()}
          </div>
          <div className="run-meta-item mano">
            <span className="material-icons-round">timer</span>
            {run.total_duration_ms && run.total_duration_ms > 0
              ? (run.total_duration_ms / 1000).toFixed(1) + "s"
              : "--"}
          </div>
          <div className="run-meta-item">
            <span className="material-icons-round">checklist</span>
            {run.passed || 0}p / {run.failed || 0}f
          </div>
          {run.canceled && run.cancel_reason && (
            <div className="run-meta-item">
              <span className="material-icons-round">block</span>
              {run.cancel_reason}
            </div>
          )}
        </div>
      </div>
      <div className="run-chips">
        <span className={`chip ${run.overall_status}`}>
          {run.overall_status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}