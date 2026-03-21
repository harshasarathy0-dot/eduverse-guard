import { useState } from "react";
import { ShieldCheck, TrendingUp, Users, Search, ChevronDown, ChevronUp } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { getAllTrustScores, calculateTrustScore, type TrustScoreData } from "@/lib/trustScore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "hsl(var(--success))" : score >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{score}</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value, max = 25 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 80 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold">{value}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StudentScoreCard({ data, expanded, onToggle }: { data: TrustScoreData; expanded: boolean; onToggle: () => void }) {
  const statusColor = data.status === "Excellent" ? "text-success" : data.status === "Good" ? "text-warning" : "text-destructive";
  const statusBg = data.status === "Excellent" ? "bg-success/10" : data.status === "Good" ? "bg-warning/10" : "bg-destructive/10";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card-hover transition-all duration-200">
      <button onClick={onToggle} className="w-full p-5 flex items-center gap-4 text-left">
        <ScoreRing score={data.score} size={64} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{data.studentName}</div>
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded mt-1 inline-block", statusBg, statusColor)}>{data.status}</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4 animate-fade-in">
          <div className="space-y-3">
            <BreakdownBar label="Attendance" value={data.breakdown.attendance} />
            <BreakdownBar label="Assignments" value={data.breakdown.assignments} />
            <BreakdownBar label="Security" value={data.breakdown.security} />
            <BreakdownBar label="Fees" value={data.breakdown.fees} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">RECOMMENDATIONS</h4>
            <div className="space-y-1.5">
              {data.recommendations.map((r, i) => (
                <div key={i} className="text-xs bg-muted/50 rounded-lg px-3 py-2">{r}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrustScorePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isStudent = user?.role === "student";
  const scores = isStudent ? [calculateTrustScore("s1")] : getAllTrustScores();
  const filtered = scores.filter(s => s.studentName.toLowerCase().includes(search.toLowerCase()));

  const avgScore = Math.round(scores.reduce((s, d) => s + d.score, 0) / scores.length);
  const excellent = scores.filter(s => s.status === "Excellent").length;
  const needsAttention = scores.filter(s => s.status === "Needs Attention").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-secondary" /> Digital Trust Score
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isStudent ? "Your computed trust score based on attendance, performance, security & fees." : "AI-computed trust scores for all students."}
          </p>
        </div>

        {!isStudent && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                <ScoreRing score={avgScore} />
                <div>
                  <div className="text-xs text-muted-foreground">Average Score</div>
                  <div className="text-xl font-bold">{avgScore}/100</div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="text-xs text-muted-foreground">Excellent Students</div>
                <div className="text-2xl font-bold text-success mt-1">{excellent}</div>
                <div className="text-xs text-muted-foreground">score ≥ 80</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="text-xs text-muted-foreground">Needs Attention</div>
                <div className="text-2xl font-bold text-destructive mt-1">{needsAttention}</div>
                <div className="text-xs text-muted-foreground">score &lt; 60</div>
              </div>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(data => (
            <StudentScoreCard key={data.studentId} data={data} expanded={expandedId === data.studentId}
              onToggle={() => setExpandedId(expandedId === data.studentId ? null : data.studentId)} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
