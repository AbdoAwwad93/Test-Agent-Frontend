import { useQuery } from "@tanstack/react-query";
import {
  fetchRuns as fetchRunsApi,
  sortRunsByNewest,
  type RunRecord,
} from "@/lib/api";

export function useRuns() {
  return useQuery<RunRecord[]>({
    queryKey: ["runs"],
    queryFn: fetchRunsApi,
    select: sortRunsByNewest,
    refetchInterval: 15000,
  });
}