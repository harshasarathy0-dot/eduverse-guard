import { useState } from "react";
import { Bell, AlertTriangle, DollarSign, Shield, Users, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { generateSmartAlerts, type SmartAlert } from "@/lib/trustScore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const typeIcon: Record<string, typeof Bell> = {
  attendance: Users,
  fee: DollarSign,
  security: Shield,
  academic: AlertTriangle,
};

const priorityStyle: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/10 text-warning border-warning/30",
  low: "bg-muted text-muted-foreground border-border",
};

export default function SmartAlertsPage() {
  const [alerts, setAlerts] = useState<SmartAlert[]>(() => generateSmartAlerts());
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.type === filter);
  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const highCount = alerts.filter(a => a.priority === "high" && !a.resolved).length;

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-secondary" /> Smart Alert Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Auto-generated alerts based on attendance, fees, and security conditions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Active Alerts</div>
            <div className="text-2xl font-bold mt-1">{unresolvedCount}</div>
          </div>
          <div className="bg-card border border-destructive/20 rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Critical (High)</div>
            <div className="text-2xl font-bold text-destructive mt-1">{highCount}</div>
          </div>
          <div className="bg-card border border-success/20 rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Resolved</div>
            <div className="text-2xl font-bold text-success mt-1">{alerts.filter(a => a.resolved).length}</div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "attendance", "fee", "security"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize",
                filter === f ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}>{f === "all" ? "All" : f}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(alert => {
            const Icon = typeIcon[alert.type] || Bell;
            return (
              <div key={alert.id} className={cn("bg-card border rounded-xl p-4 flex items-start gap-3 transition-all", alert.resolved && "opacity-50")}>
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                  alert.priority === "high" ? "bg-destructive/10" : alert.priority === "medium" ? "bg-warning/10" : "bg-muted"
                )}>
                  <Icon className={cn("h-4 w-4",
                    alert.priority === "high" ? "text-destructive" : alert.priority === "medium" ? "text-warning" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{alert.title}</span>
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border", priorityStyle[alert.priority])}>{alert.priority}</span>
                    {alert.resolved && <span className="text-xs text-success flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Resolved</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  <div className="text-[11px] text-muted-foreground mt-1 font-mono">
                    {alert.targetName} · {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
                {!alert.resolved && (
                  <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" onClick={() => resolveAlert(alert.id)}>Resolve</Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
