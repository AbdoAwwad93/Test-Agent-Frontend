import { useQuery } from '@tanstack/react-query';
import { fetchRun, type RunRecord } from '@/lib/api';
 
export function useRun(id: string) {
  return useQuery<RunRecord>({
    queryKey: ['run', id],
    queryFn: () => fetchRun(id),
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const run = query.state.data;
      if (!run) return false;
      // Safety net if SSE disconnects during pause/resume transitions
      if (run.overall_status === 'pause_requested' || run.overall_status === 'resuming') {
        return 1500;
      }
      return false;
    },
  });
}
