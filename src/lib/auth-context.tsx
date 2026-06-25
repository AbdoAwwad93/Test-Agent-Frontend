"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type AuthUser,
  type LoginInput,
  type RegisterInput,
  loginUser,
  registerUser,
  logoutUser,
  fetchMe,
  refreshAccessToken,
  storeTokens,
  clearTokens,
  storeUser,
  getStoredRefreshToken,
  getStoredAccessToken,
} from "@/lib/api";

// ── Query Keys ────────────────────────────────────────────────────────────────

export const authKeys = {
  me: ["auth", "me"] as const,
};

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  status: AuthStatus;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  status: "loading",
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// ── fetchMe with auto-refresh ─────────────────────────────────────────────────

/**
 * Wraps fetchMe with a transparent token-refresh fallback.
 * Called by the useQuery below on mount (and any time the query is invalidated).
 */
async function fetchMeWithRefresh(): Promise<AuthUser> {
  // No token at all → treat as unauthenticated (causes query to return null)
  if (!getStoredAccessToken()) {
    const refresh = getStoredRefreshToken();
    if (!refresh) throw new Error("unauthenticated");

    const tokens = await refreshAccessToken(refresh);
    storeTokens(tokens);
  }

  try {
    return await fetchMe();
  } catch {
    // Access token expired — try refresh once
    const refresh = getStoredRefreshToken();
    if (!refresh) {
      clearTokens();
      throw new Error("unauthenticated");
    }

    const tokens = await refreshAccessToken(refresh);
    storeTokens(tokens);
    return fetchMe();
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // ── Server state: current user ──────────────────────────────────────────────
  const {
    data: user = null,
    status: queryStatus,
  } = useQuery<AuthUser | null>({
    queryKey: authKeys.me,
    queryFn: fetchMeWithRefresh,
    // Don't retry auth failures — they're expected when logged out
    retry: false,
    // Keep the user fresh in the background
    staleTime: 5 * 60 * 1000, // 5 min
    // On error (e.g. no tokens), resolve to null instead of throwing
    // so status becomes "success" with null data → we map to "unauthenticated"
    throwOnError: false,
  });

  // Derive the auth status from query state
  const status: AuthStatus =
    queryStatus === "pending"
      ? "loading"
      : user
        ? "authenticated"
        : "unauthenticated";

  // ── Mutations ───────────────────────────────────────────────────────────────

  const loginMutation = useMutation({
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

  const registerMutation = useMutation({
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

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refresh = getStoredRefreshToken();
      if (refresh) {
        try {
          await logoutUser(refresh);
        } catch {
          // Ignore server errors — still clear local state
        }
      }
      clearTokens();
    },
    onSettled: () => {
      // Clear cached user regardless of success/failure
      queryClient.setQueryData(authKeys.me, null);
      // Optionally invalidate all queries that depend on auth
      queryClient.clear();
    },
  });

  // ── Stable callbacks ────────────────────────────────────────────────────────

  const login = useCallback(
    (input: LoginInput) => loginMutation.mutateAsync(input).then(() => undefined),
    [loginMutation],
  );

  const register = useCallback(
    (input: RegisterInput) => registerMutation.mutateAsync(input).then(() => undefined),
    [registerMutation],
  );

  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation],
  );

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ── Standalone hooks (optional, for direct use outside the context) ────────────

/** Directly access the current user query anywhere in the app. */
export function useCurrentUser() {
  return useQuery<AuthUser | null>({
    queryKey: authKeys.me,
    queryFn: fetchMeWithRefresh,
    retry: false,
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
  });
}