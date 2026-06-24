import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRun, type CreateRunInput, type CreateRunResponse } from "@/lib/api";

export function useCreateRun() {
  const queryClient = useQueryClient();

  return useMutation<CreateRunResponse, Error, CreateRunInput>({
    mutationFn: (payload: CreateRunInput) => createRun(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}