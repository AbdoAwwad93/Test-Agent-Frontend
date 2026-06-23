"use client";

import { useRouter } from "next/navigation";
import "../../features/history/history.css";
import { useHistoryFilters } from "@/features/history/hook/useHistoryFilters";
import { HistoryHeader } from "@/features/history/components/HistoryHeader";
import { Pagination } from "@/features/history/components/Pagination";
import { HistoryList } from "@/features/history/components/HistoryList";


export default function History() {
  const router = useRouter();
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    pageNumbers,
    rangeStart,
    rangeEnd,
    isLoading,
    isError,
    filteredRuns,
    paginatedRuns,
  } = useHistoryFilters();

  return (
    <div className="page active">
      <HistoryHeader
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {!isLoading && !isError && filteredRuns.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalCount={filteredRuns.length}
          onPageChange={setPage}
        />
      )}

      <HistoryList
        isLoading={isLoading}
        isError={isError}
        runs={paginatedRuns}
        onRunClick={(id) => router.push(`/runs/${id}`)}
      />
    </div>
  );
}