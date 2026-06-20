import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRun } from "@/lib/api";

export function useCreateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}