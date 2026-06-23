/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRuns } from "@/features/dashboard/hooks/UseRun";
import { PAGE_SIZE, type StatusFilter } from "../data/constant";

export function useHistoryFilters() {
  const { data: runs = [], isLoading, isError } = useRuns();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filteredRuns = useMemo(() => {
    const query = search.toLowerCase();
    return runs.filter((r) => {
      const matchesSearch =
        r.story?.toLowerCase().includes(query) ||
        r.url?.toLowerCase().includes(query) ||
        r.id?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || r.overall_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [runs, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / PAGE_SIZE));


  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const paginatedRuns = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRuns.slice(start, start + PAGE_SIZE);
  }, [filteredRuns, page]);

  const rangeStart = filteredRuns.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredRuns.length);

  // Build a compact page-number list with ellipses for large page counts,
  // e.g. 1 ... 4 5 [6] 7 8 ... 14
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const windowSize = 1;

    for (let i = 1; i <= totalPages; i++) {
      const isEdge = i === 1 || i === totalPages;
      const isNearCurrent = Math.abs(i - page) <= windowSize;

      if (isEdge || isNearCurrent) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }

    return pages;
  }, [totalPages, page]);

  return {
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

    // data
    isLoading,
    isError,
    filteredRuns,
    paginatedRuns,
  };
}