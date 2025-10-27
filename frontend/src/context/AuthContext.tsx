import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiClient } from "../services/apiClient";
import type { AuthResponse, LoginPayload, UserProfile } from "../types";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "elearning.auth";

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(stored) as AuthResponse;
    setToken(parsed.access_token);

    apiClient
      .get<UserProfile>("/auth/me", {
        headers: {
          Authorization: `Bearer ${parsed.access_token}`,
        },
      })
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const params = new URLSearchParams();
    params.append("username", payload.email);
    params.append("password", payload.password);

    const { data } = await apiClient.post<AuthResponse>("/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    setToken(data.access_token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const profileResponse = await apiClient.get<UserProfile>("/auth/me", {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    setUser(profileResponse.data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
