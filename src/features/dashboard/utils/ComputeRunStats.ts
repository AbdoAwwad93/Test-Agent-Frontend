import type { RunRecord } from "@/lib/api";

export interface RunStats {
  total: number;
  successRate: string;
  avgDur: string;
  runsLast24h: number;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const INACTIVE_STATUSES = new Set(["pending", "running"]);

export function computeRunStats(runs: RunRecord[]): RunStats {
  const now = Date.now();

  let successCount = 0;
  let totalDur = 0;
  let finishedCount = 0;
  let runsLast24h = 0;

  for (const run of runs) {
    if (run.overall_status === "pass" || run.goal_achieved === true) {
      successCount++;
    }

    if (!INACTIVE_STATUSES.has(run.overall_status) && run.total_duration_ms) {
      totalDur += run.total_duration_ms;
      finishedCount++;
    }

    const age = now - new Date(run.created_at).getTime();
    if (age <= ONE_DAY_MS) {
      runsLast24h++;
    }
  }

  return {
    total: runs.length,
    successRate: finishedCount
      ? `${Math.round((successCount / finishedCount) * 100)}%`
      : "--",
    avgDur: finishedCount
      ? `${(totalDur / finishedCount / 1000).toFixed(1)}s`
      : "--",
    runsLast24h,
  };
}