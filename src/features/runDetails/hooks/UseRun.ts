
import { useQuery } from '@tanstack/react-query';
import { fetchRun, type RunRecord } from '@/lib/api';
 
export function useRun(id: string) {
  return useQuery<RunRecord>({
    queryKey: ['run', id],
    queryFn: () => fetchRun(id),
    refetchOnWindowFocus: true,
    refetchInterval: 200,
  });
}
 
