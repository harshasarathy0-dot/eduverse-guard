import { Shield, AlertTriangle, CheckCircle2, XCircle, LogIn, Globe } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { mockLoginLogs, mockAlerts } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import RiskBadge from "@/components/RiskBadge";

interface TimelineEvent {
  id: string;
  type: "login_success" | "login_fail" | "alert" | "ip_blocked";
  title: string;
  description: string;
  timestamp: string;
  riskLevel: "low" | "medium" | "high";
  userName: string;
  icon: typeof Shield;
}

function buildTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  mockLoginLogs.forEach(l => {
    events.push({
      id: `tl-${l.id}`,
      type: l.success ? "login_success" : "login_fail",
      title: l.success ? "Successful Login" : "Failed Login Attempt",
      description: `${l.userName} from ${l.ip} (${l.device})`,
      timestamp: l.timestamp,
      riskLevel: l.riskLevel,
      userName: l.userName,
      icon: l.success ? CheckCircle2 : XCircle,
    });
  });

  mockAlerts.forEach(a => {
    events.push({
      id: `tl-${a.id}`,
      type: a.type === "IP_AUTO_BLOCKED" ? "ip_blocked" : "alert",
      title: a.type.replace(/_/g, " "),
      description: a.message,
      timestamp: a.timestamp,
      riskLevel: a.severity,
      userName: a.userName,
      icon: a.type === "IP_AUTO_BLOCKED" ? Globe : AlertTriangle,
    });
  });

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export default function RiskTimelinePage() {
  const events = buildTimeline();

  const iconBg = (level: string) =>
    level === "high" ? "bg-destructive/10 text-destructive" :
    level === "medium" ? "bg-warning/10 text-warning" :
    "bg-success/10 text-success";

  const lineBorder = (level: string) =>
    level === "high" ? "border-destructive/40" :
    level === "medium" ? "border-warning/40" :
    "border-border";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-secondary" /> Security Risk Timeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Chronological view of all security events and risk indicators.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Total Events</div>
            <div className="text-2xl font-bold mt-1">{events.length}</div>
          </div>
          <div className="bg-card border border-destructive/20 rounded-xl p-4">
            <div className="text-xs text-muted-foreground">High Risk Events</div>
            <div className="text-2xl font-bold text-destructive mt-1">{events.filter(e => e.riskLevel === "high").length}</div>
          </div>
          <div className="bg-card border border-warning/20 rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Medium Risk Events</div>
            <div className="text-2xl font-bold text-warning mt-1">{events.filter(e => e.riskLevel === "medium").length}</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-1">
            {events.map((event, i) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className={cn("relative pl-14 py-3 pr-4 rounded-lg border ml-2 transition-all hover:shadow-sm", lineBorder(event.riskLevel))}
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={cn("absolute left-0 top-4 h-8 w-8 rounded-lg flex items-center justify-center z-10", iconBg(event.riskLevel))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{event.title}</span>
                        <RiskBadge level={event.riskLevel} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono whitespace-nowrap shrink-0">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
