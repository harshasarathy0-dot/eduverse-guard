import { useState } from "react";
import { Settings, Shield, Users, Activity, Zap, AlertTriangle, CheckCircle2, XCircle, Monitor } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { mockStudents, mockLoginLogs, mockAlerts } from "@/lib/mockData";
import { mockUserSessions, mockActivityLogs } from "@/lib/mockActivity";
import { generateSmartAlerts } from "@/lib/trustScore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModuleToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: typeof Shield;
}

export default function AdminControlPage() {
  const [securityMode, setSecurityMode] = useState<"normal" | "strict">("normal");
  const [modules, setModules] = useState<ModuleToggle[]>([
    { id: "attendance", name: "Attendance Module", description: "Track and manage student attendance", enabled: true, icon: Users },
    { id: "fees", name: "Fees Module", description: "Fee structure and payment tracking", enabled: true, icon: Activity },
    { id: "placement", name: "Placement Module", description: "Career preparation and drives", enabled: true, icon: Zap },
    { id: "complaints", name: "Complaint System", description: "Anonymous complaint filing", enabled: true, icon: AlertTriangle },
    { id: "authguard", name: "AuthGuard Engine", description: "Security monitoring and risk detection", enabled: true, icon: Shield },
  ]);

  const [attackSim, setAttackSim] = useState<{ running: boolean; events: string[] }>({ running: false, events: [] });

  const activeSessions = mockUserSessions.filter(s => s.active).length;
  const activeAlerts = generateSmartAlerts().filter(a => !a.resolved).length;
  const recentActions = mockActivityLogs.length;

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const runAttackSimulation = () => {
    setAttackSim({ running: true, events: [] });
    const events = [
      "🔄 Simulating 5 rapid login attempts from IP 185.220.101.45...",
      "⚠️ AuthGuard detected anomalous behavior (risk score: 9)",
      "🔴 Login attempt #3 failed - wrong credentials",
      "🔴 Login attempt #4 failed - rate limit approaching",
      "🔴 Login attempt #5 failed - ACCOUNT LOCKED",
      "🛡️ IP 185.220.101.45 automatically blocked",
      "📨 Security alert generated: BRUTE_FORCE_DETECTED",
      "📊 Incident report auto-created",
      "✅ AuthGuard successfully defended against simulated attack",
    ];

    events.forEach((event, i) => {
      setTimeout(() => {
        setAttackSim(prev => ({ ...prev, events: [...prev.events, event] }));
        if (i === events.length - 1) setAttackSim(prev => ({ ...prev, running: false }));
      }, (i + 1) * 700);
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-secondary" /> Admin Control Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">System health, module control, and security mode management.</p>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold mt-1">{activeSessions}</div>
            <div className="flex items-center gap-1 mt-1"><span className="h-2 w-2 rounded-full bg-success animate-pulse" /><span className="text-xs text-success">Online</span></div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Total Students</div>
            <div className="text-2xl font-bold mt-1">{mockStudents.length}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Active Alerts</div>
            <div className="text-2xl font-bold text-warning mt-1">{activeAlerts}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Recent Actions</div>
            <div className="text-2xl font-bold mt-1">{recentActions}</div>
          </div>
        </div>

        {/* Security Mode */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center",
                securityMode === "strict" ? "bg-destructive/10" : "bg-success/10"
              )}>
                <Shield className={cn("h-5 w-5", securityMode === "strict" ? "text-destructive" : "text-success")} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Security Mode</h3>
                <p className="text-xs text-muted-foreground">
                  {securityMode === "strict" ? "Strict: Enhanced checks, faster session expiry, stricter risk thresholds" : "Normal: Standard security protocols active"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("text-xs font-semibold", securityMode === "normal" ? "text-success" : "text-muted-foreground")}>Normal</span>
              <Switch checked={securityMode === "strict"} onCheckedChange={c => setSecurityMode(c ? "strict" : "normal")} />
              <span className={cn("text-xs font-semibold", securityMode === "strict" ? "text-destructive" : "text-muted-foreground")}>Strict</span>
            </div>
          </div>
        </div>

        {/* Module Control */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Module Control</h3>
          <div className="space-y-3">
            {modules.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 rounded-md flex items-center justify-center", m.enabled ? "bg-secondary/10" : "bg-muted")}>
                      <Icon className={cn("h-4 w-4", m.enabled ? "text-secondary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.description}</div>
                    </div>
                  </div>
                  <Switch checked={m.enabled} onCheckedChange={() => toggleModule(m.id)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Attack Simulator */}
        <div className="bg-card border border-destructive/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Simulated Attack Mode</h3>
                <p className="text-xs text-muted-foreground">Demo feature: Simulate a brute-force attack to showcase AuthGuard</p>
              </div>
            </div>
            <Button size="sm" variant="destructive" onClick={runAttackSimulation} disabled={attackSim.running}>
              {attackSim.running ? "Running..." : "Run Simulation"}
            </Button>
          </div>
          {attackSim.events.length > 0 && (
            <div className="bg-background rounded-lg p-4 font-mono text-xs space-y-1.5 max-h-[300px] overflow-auto">
              {attackSim.events.map((event, i) => (
                <div key={i} className="animate-fade-in">{event}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
