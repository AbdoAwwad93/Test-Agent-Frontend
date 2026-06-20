"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { computeRunStats } from "@/features/dashboard/utils/ComputeRunStats";
import { useRuns } from "@/features/dashboard/hooks/UseRun";

export default function Dashboard() {
  const router = useRouter();
  const { data: runs = [], isLoading, isError } = useRuns();

  const stats = useMemo(() => computeRunStats(runs), [runs]);

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Good evening, Tester.</h1>
          <p className="page-subtitle">
            Here is the current state of your test environments.
          </p>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/runs/new" className="btn btn-primary">
            <span className="material-icons-round">add</span>
            New Test
          </Link>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Executions</span>
          <span className="stat-value">{isLoading ? "--" : stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Success Rate</span>
          <span className="stat-value accent">
            {isLoading ? "--" : stats.successRate}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Duration</span>
          <span className="stat-value">{isLoading ? "--" : stats.avgDur}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Last 24 h</span>
          <span className="stat-value">
            {isLoading ? "--" : stats.runsLast24h}
          </span>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Recent Sequences</h2>
      </div>

      <div className="runs-list">
        {isLoading ? (
          <div className="skeleton-list">
            <div className="skeleton"></div>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
          </div>
        ) : isError ? (
          <div className="empty-state">
            <p>Could not load runs. Please try again.</p>
          </div>
        ) : runs.length === 0 ? (
          <div className="empty-state">
            <p>No runs found.</p>
          </div>
        ) : (
          runs.slice(0, 5).map((run) => (
            <div
              key={run.id}
              className={`run-card ${run.overall_status}`}
              onClick={() => router.push(`/runs/${run.id}`)}
            >
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
                      ? `${(run.total_duration_ms / 1000).toFixed(1)}s`
                      : "--"}
                  </div>
                </div>
              </div>
              <div className="run-chips">
                <span className={`chip ${run.overall_status}`}>
                  {run.overall_status}
                </span>
                {run.canceled && run.cancel_reason && (
                  <span className="chip canceled">{run.cancel_reason}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}