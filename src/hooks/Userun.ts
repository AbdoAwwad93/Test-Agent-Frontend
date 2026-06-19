
import { useQuery } from '@tanstack/react-query';
import { type RunRecord } from '@/lib/api';
 
export function useRun(id: string) {
  return useQuery<RunRecord>({
    queryKey: ['run', id],
    refetchOnWindowFocus: false,
  });
}
 
