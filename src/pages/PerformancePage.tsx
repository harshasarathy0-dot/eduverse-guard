import { TrendingUp, BarChart3, Target, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { cn } from "@/lib/utils";

const subjectPerformance = [
  { subject: "Algorithm Design", score: 82, avg: 71, max: 95 },
  { subject: "Data Structures", score: 74, avg: 68, max: 92 },
  { subject: "Matrix Theory", score: 68, avg: 72, max: 95 },
  { subject: "Neural Networks", score: 84, avg: 65, max: 90 },
];

const radarData = [
  { subject: "Algorithms", A: 82 },
  { subject: "Data Struct.", A: 74 },
  { subject: "Matrix", A: 68 },
  { subject: "ML", A: 84 },
  { subject: "Attendance", A: 90 },
];

const attendanceTrend = [
  { month: "Oct", rate: 92 },
  { month: "Nov", rate: 88 },
  { month: "Dec", rate: 85 },
  { month: "Jan", rate: 90 },
  { month: "Feb", rate: 82 },
  { month: "Mar", rate: 88 },
];

const weakSubjects = subjectPerformance.filter(s => s.score < s.avg);

export default function PerformancePage() {
  const { user } = useAuth();
  const isStudentOrParent = user?.role === "student" || user?.role === "parent";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-secondary" /> Performance Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isStudentOrParent ? "Detailed analysis of academic performance." : "Student performance analytics across departments."}
          </p>
        </div>

        {weakSubjects.length > 0 && (
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Weak Subject Alert</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Performance below class average in: {weakSubjects.map(s => s.subject).join(", ")}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Overall Average</div>
            <div className="text-2xl font-bold mt-1">77%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Best Subject</div>
            <div className="text-2xl font-bold mt-1 text-success">ML</div>
            <div className="text-xs text-muted-foreground">84%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Needs Improvement</div>
            <div className="text-2xl font-bold mt-1 text-warning">Matrix</div>
            <div className="text-xs text-muted-foreground">68%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Attendance Avg</div>
            <div className="text-2xl font-bold mt-1">88%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Subject-wise Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="subject" width={110} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
                <Bar dataKey="score" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} name="Your Score" />
                <Bar dataKey="avg" fill="hsl(var(--muted-foreground) / 0.3)" radius={[0, 4, 4, 0]} name="Class Avg" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Skill Radar</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="A" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.2)" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold text-sm mb-4">Attendance Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
              <Bar dataKey="rate" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
