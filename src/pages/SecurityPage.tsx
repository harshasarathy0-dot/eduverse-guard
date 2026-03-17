import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import RiskBadge from "@/components/RiskBadge";
import StatCard from "@/components/StatCard";
import { mockLoginLogs, mockAlerts, mockUsers } from "@/lib/mockData";
import { Shield, AlertTriangle, Lock, Activity, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
  const [tab, setTab] = useState("logs");
  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved);
  const lockedUsers = mockUsers.filter((u) => u.status === "locked");
  const highRiskLogs = mockLoginLogs.filter((l) => l.riskLevel === "high");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-secondary" />
            <h1 className="text-2xl font-bold tracking-tight">AuthGuard Security Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time security monitoring and risk analysis engine
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Logins (7d)" value={mockLoginLogs.length} icon={<Activity className="h-4 w-4" />} />
          <StatCard title="High Risk Events" value={highRiskLogs.length} icon={<AlertTriangle className="h-4 w-4" />} className="border-destructive/30" />
          <StatCard title="Active Alerts" value={unresolvedAlerts.length} icon={<Shield className="h-4 w-4" />} />
          <StatCard title="Locked Accounts" value={lockedUsers.length} icon={<Lock className="h-4 w-4" />} className={lockedUsers.length > 0 ? "border-warning/30" : ""} />
        </div>

        {/* Risk Score Formula Card */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-secondary" />
            AuthGuard Risk Score Formula
          </h3>
          <code className="font-mono text-xs bg-muted px-3 py-2 rounded block">
            risk_score = (failed_attempts × 2) + (new_ip × 5) + (odd_time_login × 3)
          </code>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Low: 0–3</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Medium: 4–7</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> High: 8+</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="logs">Login Logs</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              {unresolvedAlerts.length > 0 && (
                <span className="ml-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 w-4 inline-flex items-center justify-center">
                  {unresolvedAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Suspicious Users</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="mt-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">IP Address</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Device</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Time</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLoginLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-100">
                      <td className="px-4 py-3 font-medium">{log.userName}</td>
                      <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
                      <td className="px-4 py-3 font-mono text-xs">{log.device}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {log.success ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 className="h-3 w-3" /> Success</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive"><XCircle className="h-3 w-3" /> Failed</span>
                        )}
                      </td>
                      <td className="px-4 py-3"><RiskBadge level={log.riskLevel} score={log.riskScore} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "bg-card border rounded-lg p-4 flex items-start gap-3",
                    alert.severity === "high" && !alert.resolved && "border-destructive/40",
                    alert.severity === "medium" && !alert.resolved && "border-warning/40",
                    alert.resolved && "opacity-60"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 h-8 w-8 rounded-md flex items-center justify-center shrink-0",
                    alert.severity === "high" ? "bg-destructive/10" : "bg-warning/10"
                  )}>
                    <AlertTriangle className={cn("h-4 w-4", alert.severity === "high" ? "text-destructive" : "text-warning")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{alert.type.replace(/_/g, " ")}</span>
                      <RiskBadge level={alert.severity} />
                      {alert.resolved && <span className="text-xs text-success font-medium">Resolved</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                    <div className="text-xs text-muted-foreground mt-1 font-mono">
                      {alert.userName} · {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Failed Attempts</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Last IP</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers
                    .filter((u) => u.failedAttempts > 0 || u.status === "locked")
                    .map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-100">
                        <td className="px-4 py-3">
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </td>
                        <td className="px-4 py-3 capitalize">{u.role}</td>
                        <td className="px-4 py-3 font-mono">{u.failedAttempts}</td>
                        <td className="px-4 py-3 font-mono text-xs">{u.lastIp}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded",
                            u.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          )}>
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
