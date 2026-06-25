import { fetchMe, RegisterInput, registerUser, storeTokens, storeUser } from "@/lib/api";
import { authKeys } from "@/lib/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const tokens = await registerUser(input);
      storeTokens(tokens);
      const u = await fetchMe();
      storeUser(u);
      return u;
    },
    onSuccess: (u) => {
      queryClient.setQueryData(authKeys.me, u);
    },
  });
}