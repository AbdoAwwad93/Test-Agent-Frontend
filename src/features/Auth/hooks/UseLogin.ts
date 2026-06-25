import { fetchMe, LoginInput, loginUser, storeTokens, storeUser } from "@/lib/api";
import { authKeys } from "@/lib/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const tokens = await loginUser(input);
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