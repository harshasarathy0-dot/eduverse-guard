import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Resolve role + profile from Supabase for a given user id/email
  async function resolveUser(uid: string, email: string, name?: string): Promise<AuthUser | null> {
    // Get role
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const role = (roles && roles.length > 0 ? roles[0].role : "student") as UserRole;

    // Get profile
    const { data: profiles } = await supabase.from("profiles").select("name, avatar_url").eq("user_id", uid);
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;
    const displayName = profile?.name || name || email;

    return {
      id: uid,
      name: displayName,
      email,
      role,
      avatar: displayName.charAt(0).toUpperCase(),
    };
  }

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const resolved = await resolveUser(session.user.id, session.user.email || "");
        setUser(resolved);
      }
      setLoading(false);
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const resolved = await resolveUser(session.user.id, session.user.email || "");
        setUser(resolved);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, _role: UserRole): Promise<boolean> => {
    // Try sign in first
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // If user doesn't exist, auto-register for demo convenience
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: email.split("@")[0] } },
      });
      if (signUpError || !signUpData.user) return false;

      // Assign the requested role
      await supabase.from("user_roles").insert({ user_id: signUpData.user.id, role: _role });
      // Create profile
      await supabase.from("profiles").insert({ user_id: signUpData.user.id, name: email.split("@")[0], email });

      const resolved = await resolveUser(signUpData.user.id, email, email.split("@")[0]);
      setUser(resolved);
      return true;
    }

    if (data.user) {
      const resolved = await resolveUser(data.user.id, data.user.email || "");
      setUser(resolved);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
