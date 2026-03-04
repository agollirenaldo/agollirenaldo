import { useCallback, useState } from "react";

import { apiClient, withAuth } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

export function useAuthenticatedRequest() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T,>(config: Parameters<typeof apiClient.request<T>>[0]) => {
      setIsLoading(true);
      setError(null);
      try {
        const authConfig = withAuth(token);
        const response = await apiClient.request<T>({
          ...config,
          headers: {
            ...(config.headers ?? {}),
            ...authConfig.headers,
          },
        });
        return response.data;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Diçka shkoi keq");
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return { request, isLoading, error };
}
