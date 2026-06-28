import { fetchMe, RegisterInput, registerUser, storeAccessToken, storeUser } from "@/lib/api";
import { authKeys } from "@/lib/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const res = await registerUser(input);
      storeAccessToken(res.access_token);
      const u = await fetchMe();
      storeUser(u);
      return u;
    },
    onSuccess: (u) => {
      queryClient.setQueryData(authKeys.me, u);
    },
  });
}