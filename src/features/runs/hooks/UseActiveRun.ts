import { useQuery } from "@tanstack/react-query";
import { fetchRuns, isRunActive, type RunRecord } from "@/lib/api";

export function useActiveRun() {
  return useQuery<RunRecord[], Error, RunRecord | undefined>({
    queryKey: ["runs"],
    queryFn: fetchRuns,
    select: (runs) => runs.find((run) => isRunActive(run)),
    refetchInterval: 5000, 
  });
}