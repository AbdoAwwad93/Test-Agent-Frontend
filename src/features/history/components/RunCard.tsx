"use client";

import type { RunRecord } from "@/lib/api";

interface RunCardProps {
  run: RunRecord;
  onClick: () => void;
}

export function RunCard({ run, onClick }: RunCardProps) {
  return (
    <div className={`run-card ${run.overall_status}`} onClick={onClick}>
      <div className={`run-status-dot ${run.overall_status}`}></div>
      <div className="run-info">
        <div className="run-story">{run.story}</div>
        <div className="run-meta">
          <span className="run-id">{run.id.substring(0, 8)}</span>
          <div className="run-meta-item">
            <span className="material-icons-round">link</span>
            {run.url}
          </div>
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