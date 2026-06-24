import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pauseRun, type RunRecord } from '@/lib/api';

export function usePauseRun(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => pauseRun(id, reason),

    onMutate: async () => {
      const previousRun = queryClient.getQueryData<RunRecord>(['run', id]);

      queryClient.setQueryData<RunRecord>(['run', id], (old) =>
        old ? { ...old, overall_status: 'pause_requested' } : old,
      );

      return { previousRun };
    },

    onError: (_err, _reason, context) => {
      if (context?.previousRun) {
        queryClient.setQueryData<RunRecord>(['run', id], context.previousRun);
      }
    },


    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['run', id] });
    },
  });
}