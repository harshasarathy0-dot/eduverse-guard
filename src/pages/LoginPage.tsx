import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2, GraduationCap, Users, UserCheck, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth, type UserRole } from "@/lib/authContext";
import { cn } from "@/lib/utils";

const roleOptions: { value: UserRole; label: string; desc: string; icon: React.ElementType; gradient: string }[] = [
  { value: "admin", label: "Admin", desc: "Full system control", icon: Shield, gradient: "from-secondary to-secondary/70" },
  { value: "staff", label: "Staff", desc: "Teaching & alerts", icon: Users, gradient: "from-warning to-warning/70" },
  { value: "student", label: "Student", desc: "Courses & grades", icon: GraduationCap, gradient: "from-success to-success/70" },
  { value: "parent", label: "Parent", desc: "Child progress", icon: Heart, gradient: "from-accent to-accent/70" },
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
    await new Promise((r) => setTimeout(r, 700));

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
      <div className="hidden lg:flex lg:w-1/2 login-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative z-10 max-w-md text-primary-foreground animate-fade-up">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center border border-white/10 shadow-lg shadow-primary/30">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">EDUVERSE</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 leading-tight" style={{ lineHeight: '1.15' }}>
            Intelligent Education<br />Management System
          </h2>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-sm">
            Powered by AuthGuard — real-time security monitoring with intelligent risk scoring and automated threat prevention.
          </p>
          <div className="mt-10 space-y-4 text-sm text-primary-foreground/50">
            {[
              "Secure credential-based authentication",
              "IP & device anomaly detection",
              "Automated IP blocking & alerts",
              "Role-based access control",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3" style={{ animationDelay: `${400 + i * 80}ms` }}>
                <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-xl font-bold">EDUVERSE</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-8">
            Select your role and sign in securely
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2.5 mb-8">
            {roleOptions.map((r) => {
              const active = selectedRole === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleRoleSelect(r.value)}
                  className={cn(
                    "relative border-2 rounded-xl p-3.5 text-left transition-all duration-200 active:scale-[0.97] group",
                    active
                      ? "border-secondary bg-secondary/5 shadow-glow"
                      : "border-border hover:border-muted-foreground/30 hover:shadow-card"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center text-white transition-all duration-200",
                      active ? `bg-gradient-to-br ${r.gradient}` : "bg-muted text-muted-foreground"
                    )}>
                      <r.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-sm">{r.label}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground ml-[38px]">{r.desc}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@eduverse.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                disabled={loading}
                className="mt-1.5 h-11 rounded-lg transition-shadow duration-200 focus-visible:shadow-glow"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  disabled={loading}
                  className="h-11 rounded-lg transition-shadow duration-200 focus-visible:shadow-glow pr-10"
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
              <div className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2.5 animate-fade-up">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold transition-all duration-200 active:scale-[0.97] shadow-sm hover:shadow-glow"
              disabled={loading}
            >
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

          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-5 w-5 rounded-md bg-success/10 flex items-center justify-center">
              <Shield className="h-3 w-3 text-success" />
            </div>
            <span>Protected by AuthGuard · Secure login with risk monitoring</span>
          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground">
            <strong className="text-foreground">Demo:</strong> Select a role — credentials auto-fill. Or enter manually.
          </div>
        </div>
      </div>
    </div>
  );
}
