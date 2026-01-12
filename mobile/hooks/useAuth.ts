import { api } from "../mobile/services/api";
import { useSecureStore } from "../hooks/useSecureStore";
import { useAuthStore } from "../store/auth";

type Credentials = {
  email: string;
  password: string;
};

export function useAuth() {
  const { user, setUser, loading, setLoading } = useAuthStore();
  const secure = useSecureStore();

  const login = async (credentials: Credentials): Promise<any> => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", credentials);
      await secure.set("access_token", data.accessToken);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await secure.remove("access_token");
    setUser(null);
  };

  const hydrate = async (): Promise<void> => {
    const token = await secure.get("access_token");
    if (!token) return;
    const { data } = await api.get("/auth/me");
    setUser(data);
  };

  return { user, login, logout, hydrate, loading };
}