"use client";

import { STATUS_FILTERS, type StatusFilter } from "../data/constant";

interface HistoryHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
}

export function HistoryHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: HistoryHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">Test Execution History</h1>
        <p className="page-subtitle">
          Review and analyze the outcomes of previous automated story
          evaluations.
        </p>
      </div>

      <div className="history-controls">
        <div className="search-wrap">
          <span className="material-icons-round">search</span>
          <input
            type="text"
            className="search-input"
            placeholder="Filter sequences…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="status-filter-group">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`status-filter-btn${
                statusFilter === f.value ? ` active ${f.value}` : ""
              }`}
              onClick={() => onStatusFilterChange(f.value)}
              aria-pressed={statusFilter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}