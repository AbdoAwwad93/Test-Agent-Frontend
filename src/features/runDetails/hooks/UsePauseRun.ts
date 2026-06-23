import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pauseRun, type RunRecord } from '@/lib/api';

export function usePauseRun(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => pauseRun(id, reason),
    onMutate: () => {
      queryClient.setQueryData<RunRecord>(['run', id], (old) =>
        old ? { ...old, overall_status: 'pause_requested' } : old,
      );
    },
    onSuccess: (data) => {
      if (data.status === 'pause_requested') {
        queryClient.setQueryData<RunRecord>(['run', id], (old) =>
          old ? { ...old, overall_status: 'pause_requested' } : old,
        );
      }
    },
  });
}
