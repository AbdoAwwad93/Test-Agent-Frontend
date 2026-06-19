
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelRun, type RunRecord } from '@/lib/api';
 
export function useCancelRun(id: string) {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (reason: string) => cancelRun(id, reason),
    onSuccess: (_data, reason) => {
      queryClient.setQueryData<RunRecord>(['run', id], (old) =>
        old ? { ...old, canceled: true, cancel_reason: reason } : old,
      );
    },
  });
}
 
