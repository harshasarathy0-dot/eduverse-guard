import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth, type UserRole } from "@/lib/authContext";
import { cn } from "@/lib/utils";

const roleOptions: { value: UserRole; label: string; desc: string; color: string }[] = [
  { value: "admin", label: "Admin", desc: "Full system control & security", color: "border-secondary bg-secondary/5" },
  { value: "staff", label: "Staff", desc: "Teaching & limited security", color: "border-warning bg-warning/5" },
  { value: "student", label: "Student", desc: "Courses & assignments", color: "border-success bg-success/5" },
  { value: "parent", label: "Parent", desc: "View student progress", color: "border-muted-foreground bg-muted" },
];

const demoCredentials: Record<UserRole, { email: string; password: string }> = {
  admin: { email: "admin@eduverse.com", password: "admin123" },
  staff: { email: "sarah@eduverse.com", password: "staff123" },
  student: { email: "james@eduverse.com", password: "student123" },
  parent: { email: "robert@eduverse.com", password: "parent123" },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@eduverse.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const creds = demoCredentials[selectedRole];
    if (email === creds.email && password === creds.password) {
      login(email, password, selectedRole);
      navigate("/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-10 w-10" />
            <span className="text-3xl font-bold tracking-tight">EDUVERSE</span>
          </div>
          <h2 className="text-xl font-semibold mb-3">Intelligent Education Management</h2>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Powered by AuthGuard — a real-time security engine that monitors authentication,
            detects anomalies, and protects your institution with intelligent risk scoring and IP blocking.
          </p>
          <div className="mt-8 space-y-3 text-sm text-primary-foreground/60">
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Secure login with risk monitoring</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />IP & device anomaly detection</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Automated IP blocking & alerts</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Role-based access control</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Shield className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold">EDUVERSE</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Select your role and sign in with your credentials
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roleOptions.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRoleSelect(r.value)}
                className={cn(
                  "border-2 rounded-lg p-3 text-left transition-all duration-150 active:scale-[0.97]",
                  selectedRole === r.value ? r.color : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="font-semibold text-sm">{r.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@eduverse.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                disabled={loading}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full active:scale-[0.97] transition-transform" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                `Sign in as ${roleOptions.find((r) => r.value === selectedRole)?.label}`
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-success" />
            <span>Protected by AuthGuard · Secure login with risk monitoring</span>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
            <strong>Demo credentials:</strong> Select a role above — credentials auto-fill. Or enter manually.
          </div>
        </div>
      </div>
    </div>
  );
}
