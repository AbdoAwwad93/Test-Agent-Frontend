"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { type RunRecord, hasMultipleTargets, getRoleBadgeColor, fetchProjects } from '@/lib/api';

interface RunMetaProps {
  run: RunRecord;
  runId: string;
  liveMode: boolean;
  showRecording?: boolean;
  onToggleVideo?: () => void;
}

export function RunMeta({ run, runId, liveMode, showRecording = false, onToggleVideo }: RunMetaProps) {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const projectMap = useMemo(
    () => new Map(projects.map((p) => [p.id, p.name])),
    [projects]
  );
  return (
    <div className="run-meta-row" style={{ marginBottom: '2rem' }}>
      {hasMultipleTargets(run) ? (
        <span className="meta-tag" style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          <span className="material-icons-round" style={{ fontSize: '1rem' }}>link</span>
          {run.targets!.map((t, i) => (
            <span
              key={i}
              title={t.url}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                background: t.role ? getRoleBadgeColor(t.role) : '#6b7280',
                color: '#fff', borderRadius: '999px', padding: '0 0.5rem',
                fontSize: '0.75rem', lineHeight: '1.4rem', whiteSpace: 'nowrap',
              }}
            >
              {t.role || 'default'}
            </span>
          ))}
        </span>
      ) : (
        <span className="meta-tag">
          <span className="material-icons-round">link</span>
          {run.url}
        </span>
      )}
      {run.project_id && projectMap.has(run.project_id) && (
        <Link
          href={`/projects/${run.project_id}`}
          className="meta-tag"
          style={{ cursor: "pointer" }}
        >
          <span className="material-icons-round" style={{ fontSize: '1rem' }}>folder</span>
          <span style={{ textDecoration: "underline" }}>{projectMap.get(run.project_id)}</span>
        </Link>
      )}
      {(showRecording || !liveMode) && (
        <>
          <span className="meta-tag">
            <span className="material-icons-round">timer</span>
            {run.total_duration_ms ? (run.total_duration_ms / 1000).toFixed(1) + 's' : '—'}
          </span>
          <span className="meta-tag">
            <span className="material-icons-round">checklist</span>
            {run.passed || 0} passed / {run.failed || 0} failed
          </span>
          <button
            type="button"
            className="meta-tag"
            onClick={onToggleVideo}
            aria-pressed="false"
          >
            <span className="material-icons-round">videocam</span>
            Recording
          </button>
        </>
      )}
      {run.canceled && (
        <span className="meta-tag">
          <span className="material-icons-round">block</span>
          {run.cancel_reason || 'Canceled'}
        </span>
      )}
      {run.paused && (
        <span className="meta-tag">
          <span className="material-icons-round">pause_circle</span>
          Paused
        </span>
      )}
      <span className="meta-tag">
        <span className="material-icons-round">tag</span>#{runId.substring(0, 8)}
      </span>
    </div>
  );
}