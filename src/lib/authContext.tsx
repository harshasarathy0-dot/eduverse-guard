import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, setToken, clearToken } from "@/lib/api";

export type UserRole = "admin" | "staff" | "student" | "parent";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

// Mock credentials for when backend is unavailable
const mockUsers: Record<string, { password: string; user: AuthUser }> = {
  "admin@eduverse.com": { password: "admin123", user: { id: 1, name: "Admin User", email: "admin@eduverse.com", role: "admin", avatar: "A" } },
  "sarah@eduverse.com": { password: "staff123", user: { id: 2, name: "Dr. Sarah Chen", email: "sarah@eduverse.com", role: "staff", avatar: "S" } },
  "james@eduverse.com": { password: "student123", user: { id: 3, name: "James Wilson", email: "james@eduverse.com", role: "student", avatar: "J" } },
  "robert@eduverse.com": { password: "parent123", user: { id: 6, name: "Robert Wilson", email: "robert@eduverse.com", role: "parent", avatar: "R" } },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("eduverse_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, _role: UserRole): Promise<boolean> => {
    // Try backend first
    try {
      const res = await api.post<{ token: string; user: { id: number; name: string; email: string; role: UserRole } }>("/auth/login", { email, password });
      setToken(res.token);
      const authUser: AuthUser = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role,
        avatar: res.user.name?.charAt(0)?.toUpperCase() || "U",
      };
      setUser(authUser);
      localStorage.setItem("eduverse_user", JSON.stringify(authUser));
      return true;
    } catch {
      // Fallback to mock credentials when backend is unavailable
      const mock = mockUsers[email.toLowerCase()];
      if (mock && mock.password === password) {
        setUser(mock.user);
        localStorage.setItem("eduverse_user", JSON.stringify(mock.user));
        return true;
      }
      return false;
    }
  };

  const logout = async () => {
    clearToken();
    localStorage.removeItem("eduverse_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
