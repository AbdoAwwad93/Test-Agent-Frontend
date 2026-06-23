"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  pageNumbers: (number | "ellipsis")[];
  rangeStart: number;
  rangeEnd: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  pageNumbers,
  rangeStart,
  rangeEnd,
  totalCount,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="pagination pagination--top">
      <span className="pagination-range">
        Showing {rangeStart}–{rangeEnd} of {totalCount}
      </span>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <span className="material-icons-round">chevron_left</span>
        </button>

        {pageNumbers.map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`pagination-btn${p === page ? " active" : ""}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <span className="material-icons-round">chevron_right</span>
        </button>
      </div>
    </div>
  );
}