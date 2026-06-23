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
    staleTime: 30_000, 
    refetchOnWindowFocus: true,
  });
}