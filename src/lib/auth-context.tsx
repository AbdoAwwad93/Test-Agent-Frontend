"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
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
  getStoredUser,
  getStoredRefreshToken,
} from "@/lib/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  status: AuthStatus;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  status: "loading",
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser();
    const refresh = getStoredRefreshToken();
    if (stored && refresh) {
      // Validate token by fetching /me
      fetchMe()
        .then((u) => {
          setUser(u);
          storeUser(u);
          setStatus("authenticated");
        })
        .catch(() => {
          // Token expired — try to refresh
          refreshAccessToken(refresh)
            .then((tokens) => {
              storeTokens(tokens);
              return fetchMe();
            })
            .then((u) => {
              setUser(u);
              storeUser(u);
              setStatus("authenticated");
            })
            .catch(() => {
              clearTokens();
              setUser(null);
              setStatus("unauthenticated");
            });
        });
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const tokens = await loginUser(input);
    storeTokens(tokens);
    const u = await fetchMe();
    setUser(u);
    storeUser(u);
    setStatus("authenticated");
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const tokens = await registerUser(input);
    storeTokens(tokens);
    const u = await fetchMe();
    setUser(u);
    storeUser(u);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    const refresh = getStoredRefreshToken();
    if (refresh) {
      try {
        await logoutUser(refresh);
      } catch {
        // Ignore errors — still clear local state
      }
    }
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
