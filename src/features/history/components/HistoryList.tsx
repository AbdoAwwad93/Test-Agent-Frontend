"use client";

import type { RunRecord } from "@/lib/api";
import { RunCard } from "./RunCard";

interface HistoryListProps {
  isLoading: boolean;
  isError: boolean;
  runs: RunRecord[];
  onRunClick: (id: string) => void;
}

export function HistoryList({
  isLoading,
  isError,
  runs,
  onRunClick,
}: HistoryListProps) {
  if (isLoading) {
    return (
      <div className="history-list">
        <div className="skeleton-list">
          <div className="skeleton"></div>
          <div className="skeleton"></div>
          <div className="skeleton"></div>
          <div className="skeleton"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="history-list">
        <div className="empty-state">
          <p>
            <strong>Could not load history. Please try again.</strong>
          </p>
        </div>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="history-list">
        <div className="empty-state">
          <span className="material-icons-round">history</span>
          <p>
            <strong>No history found.</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-list">
      {runs.map((run) => (
        <RunCard key={run.id} run={run} onClick={() => onRunClick(run.id)} />
      ))}
    </div>
  );
}