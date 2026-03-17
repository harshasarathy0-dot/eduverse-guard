import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login("demo@eduverse.com", "password", selectedRole);
    navigate("/dashboard");
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
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Real-time risk score analysis</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />IP & device anomaly detection</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Automated IP blocking</div>
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

          <h1 className="text-2xl font-bold tracking-tight">
            {isRegister ? "Create Account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            {isRegister ? "Register to get started" : "Select your role and sign in"}
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roleOptions.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelectedRole(r.value)}
                className={cn(
                  "border-2 rounded-lg p-3 text-left transition-all duration-150",
                  selectedRole === r.value ? r.color : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="font-semibold text-sm">{r.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div><Label htmlFor="name">Full Name</Label><Input id="name" placeholder="John Doe" required /></div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@eduverse.com" defaultValue="demo@eduverse.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" defaultValue="password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              {isRegister ? "Create Account" : `Sign In as ${roleOptions.find(r => r.value === selectedRole)?.label}`}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsRegister(!isRegister)} className="text-secondary font-medium hover:underline">
              {isRegister ? "Sign in" : "Register"}
            </button>
          </p>

          <div className="mt-6 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
            <strong>Demo:</strong> Select any role and click Sign In. All fields are pre-filled.
          </div>
        </div>
      </div>
    </div>
  );
}
