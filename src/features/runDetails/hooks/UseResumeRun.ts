import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeRun, type RunRecord } from '@/lib/api';

export function useResumeRun(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resumeRun(id),
    onMutate: () => {
      queryClient.setQueryData<RunRecord>(['run', id], (old) =>
        old
          ? { ...old, overall_status: 'resuming', paused: false, pause_checkpoint: null }
          : old,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['run', id] });
    },
  });
}
