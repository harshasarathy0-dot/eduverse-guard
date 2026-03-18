import AppLayout from "@/components/AppLayout";
import { mockLoginLogs } from "@/lib/mockData";
import { mockUserSessions } from "@/lib/mockActivity";
import RiskBadge from "@/components/RiskBadge";
import { Shield, Monitor, Smartphone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MySecurityPage() {
  const myLogs = mockLoginLogs.filter((l) => l.userId === "3");
  const [sessions, setSessions] = useState(mockUserSessions.filter((s) => s.userId === "u3"));
  const { toast } = useToast();

  const handleTerminate = (id: string) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, active: false } : s));
    toast({ title: "Session ended", description: "Device has been logged out." });
  };

  const handleTerminateAll = () => {
    setSessions((prev) => prev.map((s) => ({ ...s, active: false })));
    toast({ title: "All sessions ended", description: "All your devices have been logged out." });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-secondary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Security</h1>
            <p className="text-sm text-muted-foreground mt-1">Review your login history and manage devices</p>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Active Sessions</h3>
            {sessions.some((s) => s.active) && (
              <button onClick={handleTerminateAll} className="text-xs font-medium text-destructive hover:text-destructive/80">Logout all devices</button>
            )}
          </div>
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  {s.device.includes("iPhone") || s.device.includes("Android") ? <Smartphone className="h-4 w-4 text-muted-foreground" /> : <Monitor className="h-4 w-4 text-muted-foreground" />}
                  <div>
                    <div className="text-sm font-medium">{s.device}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-mono">{s.ip}</span>
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{s.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", s.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>{s.active ? "Active" : "Ended"}</span>
                  {s.active && <button onClick={() => handleTerminate(s.id)} className="text-xs text-destructive font-medium">End</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login History */}
        <div className="bg-card border rounded-lg p-5">
          <h3 className="font-semibold text-sm mb-4">Login History</h3>
          <div className="space-y-2">
            {myLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{log.device}</div>
                  <div className="text-xs text-muted-foreground font-mono">{log.ip} · {new Date(log.timestamp).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", log.success ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>{log.success ? "Success" : "Failed"}</span>
                  <RiskBadge level={log.riskLevel} score={log.riskScore} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
