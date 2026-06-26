import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProject, fetchProjectRuns, type RunRecord } from "@/lib/api";

export interface RunStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
}

export interface UseProjectDetailReturn {
  project: Awaited<ReturnType<typeof fetchProject>> | undefined;
  runs: RunRecord[];
  runStats: RunStats;
  isProjectLoading: boolean;
  isProjectError: boolean;
  isRunsLoading: boolean;
}

const RUNS_STATUS = {
  PASS: "pass",
  FAIL: "fail",
  PENDING: "pending",
  RUNNING: "running",
} as const;

export function useProjectDetail(id: string): UseProjectDetailReturn {
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
    staleTime: 1000 * 60 * 5, // 5 minutes — project metadata rarely changes
  });

  const { data: runs = [], isLoading: isRunsLoading } = useQuery<RunRecord[]>({
    queryKey: ["project-runs", id],
    queryFn: () => fetchProjectRuns(id),
    staleTime: 1000 * 30, // 30 seconds — runs update more frequently
    enabled: !isProjectLoading && !isProjectError, // skip until project is confirmed
  });

  const runStats = useMemo<RunStats>(() => {
    // Single-pass aggregation instead of four separate .filter() calls
    return runs.reduce<RunStats>(
      (acc, run) => {
        acc.total += 1;
        if (run.overall_status === RUNS_STATUS.PASS) acc.passed += 1;
        else if (run.overall_status === RUNS_STATUS.FAIL) acc.failed += 1;
        else if (
          run.overall_status === RUNS_STATUS.PENDING ||
          run.overall_status === RUNS_STATUS.RUNNING
        ) {
          acc.pending += 1;
        }
        return acc;
      },
      { total: 0, passed: 0, failed: 0, pending: 0 }
    );
  }, [runs]);

  return {
    project,
    runs,
    runStats,
    isProjectLoading,
    isProjectError,
    isRunsLoading,
  };
}