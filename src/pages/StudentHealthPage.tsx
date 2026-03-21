import { Heart, ShieldCheck, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { getStudentHealth, calculateTrustScore, type StudentHealth } from "@/lib/trustScore";
import { mockStudents } from "@/lib/mockData";
import { cn } from "@/lib/utils";

function HealthIndicator({ label, value, status }: { label: string; value: string; status: "good" | "warning" | "critical" }) {
  const color = status === "good" ? "text-success border-success/30 bg-success/5" : status === "warning" ? "text-warning border-warning/30 bg-warning/5" : "text-destructive border-destructive/30 bg-destructive/5";
  return (
    <div className={cn("rounded-xl border p-4 transition-all hover:shadow-sm", color)}>
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function StudentHealthCard({ health }: { health: StudentHealth }) {
  const trust = calculateTrustScore(health.studentId);
  const overallColor = health.overall === "Good" ? "bg-success/10 text-success border-success/30" : health.overall === "Warning" ? "bg-warning/10 text-warning border-warning/30" : "bg-destructive/10 text-destructive border-destructive/30";

  const attStatus = health.attendance >= 75 ? "good" : health.attendance >= 60 ? "warning" : "critical";
  const feeStatusMap = { clear: "good", pending: "warning", overdue: "critical" } as const;
  const secMap = { low: "good", medium: "warning", high: "critical" } as const;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{health.studentName}</h3>
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded border mt-1 inline-block", overallColor)}>
            {health.overall === "Good" ? "✓" : health.overall === "Warning" ? "⚠" : "✕"} {health.overall}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Trust Score</div>
          <div className={cn("text-2xl font-bold", trust.score >= 80 ? "text-success" : trust.score >= 60 ? "text-warning" : "text-destructive")}>{trust.score}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <HealthIndicator label="Attendance" value={`${health.attendance}%`} status={attStatus} />
        <HealthIndicator label="Performance" value={`${health.performance}%`} status={health.performance >= 70 ? "good" : health.performance >= 50 ? "warning" : "critical"} />
        <HealthIndicator label="Fees" value={health.feeStatus} status={feeStatusMap[health.feeStatus]} />
        <HealthIndicator label="Security" value={health.securityRisk} status={secMap[health.securityRisk]} />
      </div>
      {trust.recommendations.length > 0 && (
        <div className="space-y-1">
          {trust.recommendations.map((r, i) => (
            <div key={i} className="text-xs bg-muted/50 rounded-lg px-3 py-2">{r}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentHealthPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const students = isStudent ? [getStudentHealth("s1")] : mockStudents.map(s => getStudentHealth(s.id));

  const good = students.filter(s => s.overall === "Good").length;
  const warning = students.filter(s => s.overall === "Warning").length;
  const critical = students.filter(s => s.overall === "Critical").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-6 w-6 text-secondary" /> Student Health Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isStudent ? "Your comprehensive academic health overview." : "Combined student data overview: academics, fees, security."}
          </p>
        </div>

        {!isStudent && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-success/20 rounded-xl p-4">
              <div className="text-xs text-muted-foreground">Good</div>
              <div className="text-2xl font-bold text-success mt-1">{good}</div>
            </div>
            <div className="bg-card border border-warning/20 rounded-xl p-4">
              <div className="text-xs text-muted-foreground">Warning</div>
              <div className="text-2xl font-bold text-warning mt-1">{warning}</div>
            </div>
            <div className="bg-card border border-destructive/20 rounded-xl p-4">
              <div className="text-xs text-muted-foreground">Critical</div>
              <div className="text-2xl font-bold text-destructive mt-1">{critical}</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {students.map(h => <StudentHealthCard key={h.studentId} health={h} />)}
        </div>
      </div>
    </AppLayout>
  );
}
