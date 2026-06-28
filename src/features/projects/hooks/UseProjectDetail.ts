import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProject, type ProjectDetailRecord, type RunRecord } from "@/lib/api";

export interface RunStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
}

export interface UseProjectDetailReturn {
  project: ProjectDetailRecord | undefined;
  runs: RunRecord[];
  runStats: RunStats;
  isProjectLoading: boolean;
  isProjectError: boolean;
}

const RUNS_STATUS = {
  PASS: "pass",
  FAIL: "fail",
  PENDING: "pending",
  RUNNING: "running",
} as const;

export function useProjectDetail(id: string): UseProjectDetailReturn {
  const { data, isLoading: isProjectLoading, isError: isProjectError } =
    useQuery<ProjectDetailRecord>({
      queryKey: ["project-detail", id],
      queryFn: () => fetchProject(id) as Promise<ProjectDetailRecord>,
      staleTime: 1000 * 30,
    });

  const runs = data?.runs ?? [];

  const runStats = useMemo<RunStats>(() => {
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
    project: data,
    runs,
    runStats,
    isProjectLoading,
    isProjectError,
  };
}