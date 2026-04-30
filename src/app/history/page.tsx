"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchRuns as fetchRunsApi,
  sortRunsByNewest,
  type RunRecord,
} from '@/lib/api';

export default function History() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadRuns() {
      try {
        const data = await fetchRunsApi();
        setRuns(sortRunsByNewest(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRuns();
  }, []);

  const filteredRuns = useMemo(() => {
    const query = search.toLowerCase();
    return runs.filter((r) => 
      r.story?.toLowerCase().includes(query) ||
      r.url?.toLowerCase().includes(query) ||
      r.id?.toLowerCase().includes(query)
    );
  }, [runs, search]);

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Test Execution History</h1>
          <p className="page-subtitle">Review and analyze the outcomes of previous automated story evaluations.</p>
        </div>
        <div className="search-wrap">
          <span className="material-icons-round">search</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Filter sequences…" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="history-list">
        {loading ? (
          <div className="skeleton-list">
            <div className="skeleton"></div>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
          </div>
        ) : filteredRuns.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons-round">history</span>
            <p><strong>No history found.</strong></p>
          </div>
        ) : (
          filteredRuns.map(run => (
            <div key={run.id} className={`run-card ${run.overall_status}`} onClick={() => router.push(`/runs/${run.id}`)}>
              <div className={`run-status-dot ${run.overall_status}`}></div>
              <div className="run-info">
                <div className="run-story">{run.story}</div>
                <div className="run-meta">
                  <span className="run-id">{run.id.substring(0, 8)}</span>
                  <div className="run-meta-item">
                    <span className="material-icons-round">link</span>{run.url}
                  </div>
                  <div className="run-meta-item">
                    <span className="material-icons-round">schedule</span>
                    {new Date(run.created_at).toLocaleString()}
                  </div>
                  <div className="run-meta-item mano">
                    <span className="material-icons-round">timer</span>
                    {run.total_duration_ms && run.total_duration_ms > 0
                      ? (run.total_duration_ms / 1000).toFixed(1) + 's'
                      : '--'}
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
                <span className={`chip ${run.overall_status}`}>{run.overall_status.toUpperCase()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
