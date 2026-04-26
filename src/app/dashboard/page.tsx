"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

type Run = {
  id: string;
  story: string;
  url: string;
  created_at: string;
  overall_status: "pass" | "fail" | "pending";
  goal_achieved?: boolean;
  total_duration_ms?: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRuns() {
      try {
        const res = await fetch(`${API_URL}/api/runs`);
        if (res.ok) {
          const data = (await res.json()) as Run[];
          setRuns(
            data.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            ),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRuns();
  }, []);

  const total = runs.length;
  let successCount = 0;
  let totalDur = 0;
  let finishedCount = 0;
  let runsLast24h = 0;
  const now = new Date().getTime();

  for (const run of runs) {
    if (run.overall_status === "pass" || run.goal_achieved === true) {
      successCount++;
    }
    if (run.overall_status !== "pending" && run.total_duration_ms) {
      totalDur += run.total_duration_ms;
      finishedCount++;
    }
    const age = now - new Date(run.created_at).getTime();
    if (age <= 24 * 3600 * 1000) {
      runsLast24h++;
    }
  }

  const successRate = finishedCount
    ? `${Math.round((successCount / finishedCount) * 100)}%`
    : "--";
  const avgDur = finishedCount
    ? `${(totalDur / finishedCount / 1000).toFixed(1)}s`
    : "--";

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
          <span className="stat-value">{loading ? "--" : total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Success Rate</span>
          <span className="stat-value accent">{loading ? "--" : successRate}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Duration</span>
          <span className="stat-value">{loading ? "--" : avgDur}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Last 24 h</span>
          <span className="stat-value">{loading ? "--" : runsLast24h}</span>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Recent Sequences</h2>
      </div>

      <div className="runs-list">
        {loading ? (
          <div className="skeleton-list">
            <div className="skeleton"></div>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
