import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "staff" | "student" | "parent";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const demoUsers: Record<UserRole, AuthUser> = {
  admin: { id: "u1", name: "Admin User", email: "admin@eduverse.com", role: "admin", avatar: "A" },
  staff: { id: "u2", name: "Dr. Sarah Chen", email: "sarah@eduverse.com", role: "staff", avatar: "S" },
  student: { id: "u3", name: "James Wilson", email: "james@eduverse.com", role: "student", avatar: "J" },
  parent: { id: "u4", name: "Robert Wilson", email: "robert@eduverse.com", role: "parent", avatar: "R" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("eduverse_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (_email: string, _password: string, role: UserRole): boolean => {
    const u = demoUsers[role];
    setUser(u);
    localStorage.setItem("eduverse_user", JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduverse_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
